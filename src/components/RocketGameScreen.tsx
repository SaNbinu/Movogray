import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import type { TherapistTask } from '../data/therapistChildren'
import './RocketGameScreen.css'

type RocketGameScreenProps = {
  task: Pick<TherapistTask, 'id' | 'title' | 'targetSound' | 'repetitions' | 'durationSeconds'>
  onBack: () => void
  onMissionComplete: () => void
}

type GameStatus = 'ready' | 'holding' | 'success' | 'finale' | 'completed'
type InputMode = 'microphone-setup' | 'microphone' | 'demo'
type MicrophoneStatus = 'idle' | 'requesting' | 'calibrating' | 'ready' | 'error' | 'unsupported'
type AudioDebugData = {
  rms: number
  lowMidEnergyRatio: number
  fricativeEnergyRatio: number
  voiceCandidate: boolean
}

const AUDIO_DEBUG = false
const NEXT_TASK_DELAY = 900
const FINAL_SEQUENCE_DELAY = 850
const CALIBRATION_DURATION = 1200
const MIN_VOICE_THRESHOLD = 0.025
const MAX_VOICE_THRESHOLD = 0.18
const LOW_MID_MIN_FREQUENCY = 80
const LOW_MID_MAX_FREQUENCY = 4000
const FRICATIVE_MIN_FREQUENCY = 2000
const FRICATIVE_MAX_FREQUENCY = 8000
const MIN_LOW_MID_ENERGY_RATIO = 0.5
const MIN_FRICATIVE_ENERGY_RATIO = 0.38
const CONTINUING_LOW_MID_ENERGY_RATIO = 0.35
const CONTINUING_FRICATIVE_ENERGY_RATIO = 0.3
const VOICE_START_DELAY = 160
const VOICE_STOP_DELAY = 160

function RocketGameScreen({ task, onBack, onMissionComplete }: RocketGameScreenProps) {
  const holdDuration = task.durationSeconds * 1000
  const totalTasks = task.repetitions
  const secondsLabel = `${task.durationSeconds} ${task.durationSeconds === 5 ? 'секунд' : 'секунди'}`
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready')
  const [holdProgress, setHoldProgress] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [rocketTravel, setRocketTravel] = useState(0)
  const [inputMode, setInputMode] = useState<InputMode>('microphone-setup')
  const [microphoneStatus, setMicrophoneStatus] = useState<MicrophoneStatus>('idle')
  const [microphoneError, setMicrophoneError] = useState('')
  const [currentVolume, setCurrentVolume] = useState(0)
  const [voiceThreshold, setVoiceThreshold] = useState(0.05)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [audioDebugData, setAudioDebugData] = useState<AudioDebugData>({
    rms: 0,
    lowMidEnergyRatio: 0,
    fricativeEnergyRatio: 0,
    voiceCandidate: false,
  })
  const animationFrameRef = useRef<number | null>(null)
  const audioFrameRef = useRef<number | null>(null)
  const nextTaskTimeoutRef = useRef<number | null>(null)
  const holdStartedAtRef = useRef(0)
  const gameStatusRef = useRef<GameStatus>('ready')
  const microphoneStatusRef = useRef<MicrophoneStatus>('idle')
  const completedTasksRef = useRef(0)
  const voiceThresholdRef = useRef(0.05)
  const voiceActiveRef = useRef(false)
  const voiceStartedAtRef = useRef<number | null>(null)
  const silenceStartedAtRef = useRef<number | null>(null)
  const calibrationStartedAtRef = useRef(0)
  const calibrationVolumeTotalRef = useRef(0)
  const calibrationSamplesRef = useRef(0)
  const lastVolumeUpdateRef = useRef(0)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null)
  const frequencyDataRef = useRef<Float32Array<ArrayBuffer> | null>(null)
  const mountedRef = useRef(true)
  const flightPathRef = useRef<HTMLDivElement>(null)
  const rocketRef = useRef<HTMLDivElement>(null)

  function updateGameStatus(status: GameStatus) {
    gameStatusRef.current = status
    setGameStatus(status)
  }

  function stopAnimationFrame() {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  function updateMicrophoneStatus(status: MicrophoneStatus) {
    microphoneStatusRef.current = status
    setMicrophoneStatus(status)
  }

  function releaseAudioResources() {
    if (audioFrameRef.current !== null) {
      cancelAnimationFrame(audioFrameRef.current)
      audioFrameRef.current = null
    }

    sourceNodeRef.current?.disconnect()
    analyserRef.current?.disconnect()
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())

    const audioContext = audioContextRef.current
    if (audioContext && audioContext.state !== 'closed') {
      void audioContext.close().catch(() => undefined)
    }

    sourceNodeRef.current = null
    analyserRef.current = null
    mediaStreamRef.current = null
    audioContextRef.current = null
    audioDataRef.current = null
    frequencyDataRef.current = null
    voiceActiveRef.current = false
    voiceStartedAtRef.current = null
    silenceStartedAtRef.current = null
  }

  function startAttempt(startedAt: number) {
    if (gameStatusRef.current !== 'ready') {
      return
    }

    stopAnimationFrame()

    const flightPathHeight = flightPathRef.current?.clientHeight ?? 0
    const rocketHeight = rocketRef.current?.clientHeight ?? 0
    setRocketTravel(Math.max(flightPathHeight - rocketHeight, 0))
    holdStartedAtRef.current = startedAt
    setFeedback(null)
    setHoldProgress(0)
    updateGameStatus('holding')
    animationFrameRef.current = requestAnimationFrame(updateHoldProgress)
  }

  function cancelAttempt() {
    if (gameStatusRef.current !== 'holding') {
      return
    }

    stopAnimationFrame()
    setHoldProgress(0)
    setFeedback(null)
    updateGameStatus('ready')
  }

  function setVoiceDetected(isActive: boolean, timestamp: number) {
    if (voiceActiveRef.current === isActive) {
      return
    }

    voiceActiveRef.current = isActive
    setIsVoiceActive(isActive)

    if (isActive) {
      startAttempt(timestamp)
    } else {
      cancelAttempt()
    }
  }

  function updateVoiceDetection(
    voiceCandidate: boolean,
    continuingVoice: boolean,
    timestamp: number,
  ) {
    if (!voiceActiveRef.current) {
      silenceStartedAtRef.current = null

      if (!voiceCandidate) {
        voiceStartedAtRef.current = null
        return
      }

      voiceStartedAtRef.current ??= timestamp
      if (timestamp - voiceStartedAtRef.current >= VOICE_START_DELAY) {
        voiceStartedAtRef.current = null
        setVoiceDetected(true, timestamp)
      }
      return
    }

    voiceStartedAtRef.current = null
    if (continuingVoice) {
      silenceStartedAtRef.current = null
      return
    }

    silenceStartedAtRef.current ??= timestamp
    if (timestamp - silenceStartedAtRef.current >= VOICE_STOP_DELAY) {
      silenceStartedAtRef.current = null
      setVoiceDetected(false, timestamp)
    }
  }

  function calculateSpeechEnergyRatios(
    analyser: AnalyserNode,
    frequencyData: Float32Array<ArrayBuffer>,
  ) {
    analyser.getFloatFrequencyData(frequencyData)
    const audioContext = audioContextRef.current
    if (!audioContext) {
      return { lowMidEnergyRatio: 0, fricativeEnergyRatio: 0 }
    }

    const frequencyPerBin = audioContext.sampleRate / analyser.fftSize
    const nyquistFrequency = audioContext.sampleRate / 2
    const fricativeUpperFrequency = Math.min(FRICATIVE_MAX_FREQUENCY, nyquistFrequency)
    let totalEnergy = 0
    let lowMidEnergy = 0
    let fricativeEnergy = 0

    for (let index = 1; index < frequencyData.length; index += 1) {
      const decibels = frequencyData[index]
      if (!Number.isFinite(decibels)) {
        continue
      }

      const energy = 10 ** (decibels / 10)
      const frequency = index * frequencyPerBin
      totalEnergy += energy

      if (
        frequency >= LOW_MID_MIN_FREQUENCY
        && frequency <= LOW_MID_MAX_FREQUENCY
      ) {
        lowMidEnergy += energy
      }

      if (
        frequency >= FRICATIVE_MIN_FREQUENCY
        && frequency <= fricativeUpperFrequency
      ) {
        fricativeEnergy += energy
      }
    }

    if (totalEnergy === 0) {
      return { lowMidEnergyRatio: 0, fricativeEnergyRatio: 0 }
    }

    return {
      lowMidEnergyRatio: lowMidEnergy / totalEnergy,
      fricativeEnergyRatio: fricativeEnergy / totalEnergy,
    }
  }

  function analyseAudio(timestamp: number) {
    const analyser = analyserRef.current
    const audioData = audioDataRef.current
    const frequencyData = frequencyDataRef.current

    if (!analyser || !audioData || !frequencyData) {
      return
    }

    analyser.getByteTimeDomainData(audioData)
    let squareTotal = 0

    for (const sample of audioData) {
      const normalizedSample = (sample - 128) / 128
      squareTotal += normalizedSample * normalizedSample
    }

    const volume = Math.sqrt(squareTotal / audioData.length)
    const { lowMidEnergyRatio, fricativeEnergyRatio } = calculateSpeechEnergyRatios(
      analyser,
      frequencyData,
    )
    const voiceCandidate = (
      volume >= voiceThresholdRef.current
      && (
        lowMidEnergyRatio >= MIN_LOW_MID_ENERGY_RATIO
        || fricativeEnergyRatio >= MIN_FRICATIVE_ENERGY_RATIO
      )
    )
    const continuingVoice = (
      volume >= voiceThresholdRef.current * 0.72
      && (
        lowMidEnergyRatio >= CONTINUING_LOW_MID_ENERGY_RATIO
        || fricativeEnergyRatio >= CONTINUING_FRICATIVE_ENERGY_RATIO
      )
    )

    if (timestamp - lastVolumeUpdateRef.current >= 50) {
      lastVolumeUpdateRef.current = timestamp
      setCurrentVolume(volume)

      if (AUDIO_DEBUG) {
        setAudioDebugData({
          rms: volume,
          lowMidEnergyRatio,
          fricativeEnergyRatio,
          voiceCandidate,
        })
      }
    }

    if (microphoneStatusRef.current === 'calibrating') {
      if (calibrationStartedAtRef.current === 0) {
        calibrationStartedAtRef.current = timestamp
      }

      calibrationVolumeTotalRef.current += volume
      calibrationSamplesRef.current += 1

      if (timestamp - calibrationStartedAtRef.current >= CALIBRATION_DURATION) {
        const noiseFloor = calibrationSamplesRef.current > 0
          ? calibrationVolumeTotalRef.current / calibrationSamplesRef.current
          : 0
        const calibratedThreshold = Math.min(
          Math.max(noiseFloor * 2.2 + 0.015, MIN_VOICE_THRESHOLD),
          MAX_VOICE_THRESHOLD,
        )

        voiceThresholdRef.current = calibratedThreshold
        setVoiceThreshold(calibratedThreshold)
        updateMicrophoneStatus('ready')
      }
    } else if (microphoneStatusRef.current === 'ready') {
      updateVoiceDetection(voiceCandidate, continuingVoice, timestamp)
    }

    audioFrameRef.current = requestAnimationFrame(analyseAudio)
  }

  async function enableMicrophone() {
    if (microphoneStatusRef.current === 'requesting' || mediaStreamRef.current) {
      return
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof AudioContext === 'undefined') {
      updateMicrophoneStatus('unsupported')
      setMicrophoneError('Мікрофон недоступний у цьому браузері')
      return
    }

    updateMicrophoneStatus('requesting')
    setMicrophoneError('')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      mediaStreamRef.current = stream
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const sourceNode = audioContext.createMediaStreamSource(stream)

      analyser.fftSize = 1024
      analyser.minDecibels = -100
      analyser.maxDecibels = -10
      analyser.smoothingTimeConstant = 0.15
      sourceNode.connect(analyser)
      audioContextRef.current = audioContext
      analyserRef.current = analyser
      sourceNodeRef.current = sourceNode
      await audioContext.resume()

      if (!mountedRef.current) {
        releaseAudioResources()
        return
      }

      audioDataRef.current = new Uint8Array(analyser.fftSize)
      frequencyDataRef.current = new Float32Array(analyser.frequencyBinCount)
      calibrationStartedAtRef.current = 0
      calibrationVolumeTotalRef.current = 0
      calibrationSamplesRef.current = 0
      lastVolumeUpdateRef.current = 0
      setInputMode('microphone')
      updateMicrophoneStatus('calibrating')
      audioFrameRef.current = requestAnimationFrame(analyseAudio)
    } catch {
      releaseAudioResources()
      if (mountedRef.current) {
        updateMicrophoneStatus('error')
        setMicrophoneError('Не вдалося отримати доступ до мікрофона')
      }
    }
  }

  function enableDemoMode() {
    releaseAudioResources()
    setCurrentVolume(0)
    setIsVoiceActive(false)
    setInputMode('demo')
  }

  function completeAttempt() {
    animationFrameRef.current = null
    const nextCompletedTasks = Math.min(completedTasksRef.current + 1, totalTasks)

    completedTasksRef.current = nextCompletedTasks
    setCompletedTasks(nextCompletedTasks)
    setHoldProgress(1)

    if (nextCompletedTasks === totalTasks) {
      updateGameStatus('finale')
      setFeedback(`${totalTasks} з ${totalTasks}!`)
      onMissionComplete()
      nextTaskTimeoutRef.current = window.setTimeout(() => {
        nextTaskTimeoutRef.current = null
        setFeedback(null)
        releaseAudioResources()
        setCurrentVolume(0)
        setIsVoiceActive(false)
        updateGameStatus('completed')
      }, FINAL_SEQUENCE_DELAY)
      return
    }

    updateGameStatus('success')
    setFeedback('Чудово!')
    nextTaskTimeoutRef.current = window.setTimeout(() => {
      nextTaskTimeoutRef.current = null
      setHoldProgress(0)
      setFeedback(null)
      updateGameStatus('ready')
    }, NEXT_TASK_DELAY)
  }

  function updateHoldProgress(timestamp: number) {
    if (gameStatusRef.current !== 'holding') {
      return
    }

    const elapsed = timestamp - holdStartedAtRef.current
    const nextProgress = Math.min(elapsed / holdDuration, 1)
    setHoldProgress(nextProgress)

    if (nextProgress === 1) {
      completeAttempt()
      return
    }

    animationFrameRef.current = requestAnimationFrame(updateHoldProgress)
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (gameStatusRef.current !== 'ready' || (event.pointerType === 'mouse' && event.button !== 0)) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    startAttempt(event.timeStamp)
  }

  function handlePointerEnd(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    cancelAttempt()
  }

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      stopAnimationFrame()
      releaseAudioResources()

      if (nextTaskTimeoutRef.current !== null) {
        window.clearTimeout(nextTaskTimeoutRef.current)
      }
    }
  }, [])

  const currentTask = Math.min(completedTasks + 1, totalTasks)
  const elapsedSeconds = (holdProgress * (holdDuration / 1000)).toFixed(1)
  const launchProgress = Math.max((holdProgress - 0.05) / 0.95, 0)
  const rocketOffset = -(rocketTravel * launchProgress)
  const rocketStyle = {
    '--rocket-offset': `${rocketOffset}px`,
    '--flame-height': `${80 + holdProgress * 25}px`,
  } as CSSProperties
  const buttonStyle = {
    '--hold-progress': `${holdProgress * 100}%`,
  } as CSSProperties
  const isFinale = gameStatus === 'finale'
  const isEngineActive = gameStatus === 'holding' || gameStatus === 'success' || isFinale
  const isBoosting = gameStatus === 'success'
  const isMicrophoneReady = inputMode === 'microphone' && microphoneStatus === 'ready'
  const meterReference = isMicrophoneReady ? Math.max(voiceThreshold * 1.8, 0.06) : 0.12
  const audioLevel = Math.min(currentVolume / meterReference, 1)
  const audioMeterStyle = {
    '--audio-level': `${audioLevel * 100}%`,
  } as CSSProperties

  return (
    <div className="rocket-game-shell" data-task-id={task.id}>
      <header className="rocket-game-header">
        <button
          className="rocket-game-header__back"
          type="button"
          onClick={onBack}
          aria-label="Повернутися на головну"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 5-7 7 7 7" />
          </svg>
        </button>

        <div className="rocket-game-header__title">
          <h1>{task.title}</h1>
          <p>Тренуємо звук «{task.targetSound}»</p>
        </div>

        <span
          className="rocket-game-header__step"
          aria-label={`${currentTask} завдання з ${totalTasks}`}
        >
          {currentTask} / {totalTasks}
        </span>
      </header>

      <main className="rocket-game-content">
        <section
          className={`space-stage${isFinale ? ' space-stage--finale' : ''}`}
          aria-label="Ігрове поле з ракетою"
        >
          <span className="space-stage__glow" aria-hidden="true" />
          <span className="space-stage__orbit" aria-hidden="true" />
          <span className="space-stage__planet" aria-hidden="true" />
          <span className="space-star space-star--one" aria-hidden="true" />
          <span className="space-star space-star--two" aria-hidden="true" />
          <span className="space-star space-star--three" aria-hidden="true" />
          <span className="space-star space-star--four" aria-hidden="true" />
          <span className="space-star space-star--five" aria-hidden="true" />
          <span className="space-star space-star--six" aria-hidden="true" />

          <div className="rocket-flight-path" ref={flightPathRef}>
            <div
              className={`rocket-position${gameStatus === 'holding' ? ' rocket-position--holding' : ''}${isBoosting ? ' rocket-position--boost' : ''}${isFinale ? ' rocket-position--finale' : ''}`}
              ref={rocketRef}
              style={rocketStyle}
            >
              <svg
                className={`game-rocket${isEngineActive ? ' game-rocket--active' : ''}${isBoosting || isFinale ? ' game-rocket--boost' : ''}`}
                viewBox="0 0 190 180"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="game-rocket-body" x1="72" y1="44" x2="124" y2="142" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" />
                    <stop offset="0.56" stopColor="#f2f3ff" />
                    <stop offset="1" stopColor="#cbd1fb" />
                  </linearGradient>
                  <filter id="game-rocket-shadow" x="20" y="0" width="150" height="180" filterUnits="userSpaceOnUse">
                    <feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="#130d50" floodOpacity="0.34" />
                  </filter>
                </defs>
                <g filter="url(#game-rocket-shadow)">
                  <path className="game-rocket__left-wing" d="M73 101c-17 10-24 28-22 51l31-18-9-33Z" />
                  <path className="game-rocket__right-wing" d="M117 101c17 10 24 28 22 51l-31-18 9-33Z" />
                  <path className="game-rocket__body" d="M95 18c26 22 36 61 27 99l-13 29H81l-13-29c-9-38 1-77 27-99Z" />
                  <path className="game-rocket__nose" d="M95 18c11 9 19 21 24 35H71c5-14 13-26 24-35Z" />
                  <path className="game-rocket__panel" d="M81 122h28l-4 14H85l-4-14Z" />
                  <circle className="game-rocket__window-frame" cx="95" cy="79" r="20" />
                  <circle className="game-rocket__window" cx="95" cy="79" r="13" />
                  <path className="game-rocket__shine" d="M89 74c3-4 7-5 11-3" />
                </g>
              </svg>
              <div
                className={`engine-flame${isEngineActive ? ' engine-flame--active' : ''}${isBoosting || isFinale ? ' engine-flame--boost' : ''}`}
                aria-hidden="true"
              >
                <span className="engine-flame__outer" />
                <span className="engine-flame__inner" />
                <span className="engine-flame__core" />
              </div>
              <div
                className={`engine-particles${gameStatus === 'holding' ? ' engine-particles--active' : ''}${isBoosting || isFinale ? ' engine-particles--boost' : ''}`}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          <div className="launch-platform" aria-hidden="true">
            <span />
          </div>

          <div className={`game-feedback${feedback ? ' game-feedback--visible' : ''}`} aria-live="polite">
            {feedback}
          </div>
        </section>

        <section
          className={`game-instruction${gameStatus === 'completed' ? ' game-instruction--completed' : ''}`}
          aria-labelledby="game-instruction-title"
        >
          <span className={`game-instruction__sound${gameStatus === 'completed' ? ' game-instruction__sound--completed' : ''}`} aria-hidden="true">
            {gameStatus === 'completed' ? '✓' : task.targetSound}
          </span>
          <div className="game-instruction__copy">
            <h2 id="game-instruction-title">
              {gameStatus === 'completed'
                ? 'Місію виконано!'
                : isMicrophoneReady
                  ? `Тягни звук «${task.targetSound}» ${secondsLabel}`
                  : `Тягни звук «${task.targetSound}» ${secondsLabel}, щоб ракета злетіла`}
            </h2>
            {isMicrophoneReady && gameStatus !== 'completed' && (
              <p>Говори безперервно, щоб ракета злетіла</p>
            )}
            {gameStatus === 'completed' && (
              <>
                <p>Ти виконав усі {totalTasks} завдань зі звуком «{task.targetSound}»</p>
                <div className="mission-reward">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m12 3 2.7 5.4 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9Z" />
                  </svg>
                  +25 очок
                </div>
              </>
            )}
          </div>
        </section>

        <section
          className="mission-progress"
          aria-label={`Прогрес місії: виконано ${completedTasks} з ${totalTasks} завдань`}
        >
          <div className="mission-progress__heading">
            <span>Прогрес місії</span>
            <span className="mission-progress__timer">
              {gameStatus === 'holding' ? `${elapsedSeconds} с` : secondsLabel}
            </span>
            <strong>{currentTask} з {totalTasks}</strong>
          </div>
          <div className="mission-progress__steps" aria-hidden="true">
            {Array.from({ length: totalTasks }, (_, index) => {
              const isCompleted = index < completedTasks
              const isCurrent = index === completedTasks && gameStatus !== 'completed'
              const segmentStyle = isCurrent
                ? ({ '--segment-progress': `${holdProgress * 100}%` } as CSSProperties)
                : undefined

              return (
                <span
                  className={`mission-progress__step${isCompleted ? ' mission-progress__step--completed' : ''}${isCurrent ? ' mission-progress__step--current' : ''}`}
                  style={segmentStyle}
                  key={index}
                />
              )
            })}
          </div>
        </section>

        {gameStatus === 'completed' ? (
          <button className="return-home-button" type="button" onClick={onBack}>
            На головну
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        ) : inputMode === 'demo' ? (
          <button
            className={`hold-sound-button${gameStatus === 'holding' ? ' hold-sound-button--active' : ''}${gameStatus === 'success' || isFinale ? ' hold-sound-button--waiting' : ''}`}
            type="button"
            aria-describedby="demo-mode-note"
            aria-pressed={gameStatus === 'holding'}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onLostPointerCapture={handlePointerEnd}
            style={buttonStyle}
          >
            <svg viewBox="0 0 30 30" aria-hidden="true">
              <circle cx="15" cy="15" r="4" />
              <path d="M8.8 8.8a8.8 8.8 0 0 0 0 12.4m12.4 0a8.8 8.8 0 0 0 0-12.4M5 5a14.1 14.1 0 0 0 0 20m20 0a14.1 14.1 0 0 0 0-20" />
            </svg>
            <span>
              {gameStatus === 'success'
                ? 'Наступне завдання...'
                : isFinale
                  ? 'Фінальний зліт...'
                  : 'Утримуй звук'}
            </span>
          </button>
        ) : (
          <section className="microphone-control" aria-live="polite">
            {microphoneStatus === 'idle' && (
              <>
                <button className="microphone-enable-button" type="button" onClick={enableMicrophone}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="8" y="3" width="8" height="12" rx="4" />
                    <path d="M5 11a7 7 0 0 0 14 0M12 18v3m-4 0h8" />
                  </svg>
                  Увімкнути мікрофон
                </button>
                <button className="demo-mode-button" type="button" onClick={enableDemoMode}>
                  Демо без мікрофона
                </button>
              </>
            )}

            {microphoneStatus === 'requesting' && (
              <div className="microphone-state microphone-state--loading">
                <span className="microphone-state__indicator" aria-hidden="true" />
                <div>
                  <strong>Підключаємо мікрофон...</strong>
                  <p>Підтвердь доступ у браузері</p>
                </div>
              </div>
            )}

            {(microphoneStatus === 'calibrating' || microphoneStatus === 'ready') && (
              <div className={`microphone-state${isVoiceActive ? ' microphone-state--voice' : ''}`}>
                <div className="microphone-state__copy">
                  <span className="microphone-state__indicator" aria-hidden="true" />
                  <div>
                    <strong>
                      {microphoneStatus === 'calibrating'
                        ? 'Мікрофон увімкнено'
                        : 'Мікрофон готовий'}
                    </strong>
                    <p>
                      {microphoneStatus === 'calibrating'
                        ? 'Калібруємо тишу, зачекай ще мить'
                        : isVoiceActive
                          ? 'Чуємо твій голос'
                          : 'Починай, коли будеш готовий'}
                    </p>
                  </div>
                </div>
                <div
                  className={`audio-level${isVoiceActive ? ' audio-level--active' : ''}`}
                  style={audioMeterStyle}
                  aria-label={isVoiceActive ? 'Голос виявлено' : 'Очікуємо на голос'}
                >
                  <span />
                </div>
                {AUDIO_DEBUG && (
                  <dl className="audio-debug">
                    <div><dt>RMS</dt><dd>{audioDebugData.rms.toFixed(4)}</dd></div>
                    <div><dt>Threshold</dt><dd>{voiceThreshold.toFixed(4)}</dd></div>
                    <div><dt>Low/mid ratio</dt><dd>{audioDebugData.lowMidEnergyRatio.toFixed(3)}</dd></div>
                    <div><dt>Fricative ratio</dt><dd>{audioDebugData.fricativeEnergyRatio.toFixed(3)}</dd></div>
                    <div><dt>Candidate</dt><dd>{String(audioDebugData.voiceCandidate)}</dd></div>
                    <div><dt>Voice active</dt><dd>{String(isVoiceActive)}</dd></div>
                  </dl>
                )}
              </div>
            )}

            {(microphoneStatus === 'error' || microphoneStatus === 'unsupported') && (
              <div className="microphone-error">
                <p>{microphoneError}</p>
                <div className="microphone-error__actions">
                  {microphoneStatus === 'error' && (
                    <button type="button" onClick={enableMicrophone}>Спробувати ще раз</button>
                  )}
                  <button type="button" onClick={enableDemoMode}>Демо без мікрофона</button>
                </div>
              </div>
            )}
          </section>
        )}
        {gameStatus !== 'completed' && inputMode === 'demo' && (
          <p className="demo-mode-note" id="demo-mode-note">
            Демо-режим: утримування кнопки імітує вимову звуку
          </p>
        )}
      </main>
    </div>
  )
}

export default RocketGameScreen
