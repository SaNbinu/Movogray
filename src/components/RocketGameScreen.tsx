import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import './RocketGameScreen.css'

type RocketGameScreenProps = {
  onBack: () => void
  onMissionComplete: () => void
}

type GameStatus = 'ready' | 'holding' | 'success' | 'finale' | 'completed'

const HOLD_DURATION = 3000
const NEXT_TASK_DELAY = 900
const FINAL_SEQUENCE_DELAY = 850
const TOTAL_TASKS = 5

function RocketGameScreen({ onBack, onMissionComplete }: RocketGameScreenProps) {
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready')
  const [holdProgress, setHoldProgress] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [rocketTravel, setRocketTravel] = useState(0)
  const animationFrameRef = useRef<number | null>(null)
  const nextTaskTimeoutRef = useRef<number | null>(null)
  const holdStartedAtRef = useRef(0)
  const gameStatusRef = useRef<GameStatus>('ready')
  const completedTasksRef = useRef(0)
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

  function completeAttempt() {
    animationFrameRef.current = null
    const nextCompletedTasks = Math.min(completedTasksRef.current + 1, TOTAL_TASKS)

    completedTasksRef.current = nextCompletedTasks
    setCompletedTasks(nextCompletedTasks)
    setHoldProgress(1)

    if (nextCompletedTasks === TOTAL_TASKS) {
      updateGameStatus('finale')
      setFeedback('5 з 5!')
      onMissionComplete()
      nextTaskTimeoutRef.current = window.setTimeout(() => {
        nextTaskTimeoutRef.current = null
        setFeedback(null)
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
    const nextProgress = Math.min(elapsed / HOLD_DURATION, 1)
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
    stopAnimationFrame()

    const flightPathHeight = flightPathRef.current?.clientHeight ?? 0
    const rocketHeight = rocketRef.current?.clientHeight ?? 0
    setRocketTravel(Math.max(flightPathHeight - rocketHeight, 0))
    holdStartedAtRef.current = performance.now()
    setFeedback(null)
    setHoldProgress(0)
    updateGameStatus('holding')
    animationFrameRef.current = requestAnimationFrame(updateHoldProgress)
  }

  function handlePointerEnd(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (gameStatusRef.current !== 'holding') {
      return
    }

    stopAnimationFrame()
    setHoldProgress(0)
    setFeedback(null)
    updateGameStatus('ready')
  }

  useEffect(() => {
    return () => {
      stopAnimationFrame()

      if (nextTaskTimeoutRef.current !== null) {
        window.clearTimeout(nextTaskTimeoutRef.current)
      }
    }
  }, [])

  const currentTask = Math.min(completedTasks + 1, TOTAL_TASKS)
  const elapsedSeconds = (holdProgress * (HOLD_DURATION / 1000)).toFixed(1)
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

  return (
    <div className="rocket-game-shell">
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
          <h1>Запусти ракету</h1>
          <p>Тренуємо звук «Р»</p>
        </div>

        <span
          className="rocket-game-header__step"
          aria-label={`${currentTask} завдання з ${TOTAL_TASKS}`}
        >
          {currentTask} / {TOTAL_TASKS}
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
            {gameStatus === 'completed' ? '✓' : 'Р'}
          </span>
          <div className="game-instruction__copy">
            <h2 id="game-instruction-title">
              {gameStatus === 'completed'
                ? 'Місію виконано!'
                : 'Тягни звук «Р-р-р...» 3 секунди, щоб ракета злетіла'}
            </h2>
            {gameStatus === 'completed' && (
              <>
                <p>Ти виконав усі 5 завдань зі звуком «Р»</p>
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
          aria-label={`Прогрес місії: виконано ${completedTasks} з ${TOTAL_TASKS} завдань`}
        >
          <div className="mission-progress__heading">
            <span>Прогрес місії</span>
            <span className="mission-progress__timer">
              {gameStatus === 'holding' ? `${elapsedSeconds} с` : '3 секунди'}
            </span>
            <strong>{currentTask} з {TOTAL_TASKS}</strong>
          </div>
          <div className="mission-progress__steps" aria-hidden="true">
            {Array.from({ length: TOTAL_TASKS }, (_, index) => {
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
        ) : (
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
        )}
        {gameStatus !== 'completed' && (
          <p className="demo-mode-note" id="demo-mode-note">
            Демо-режим: утримування кнопки імітує вимову звуку
          </p>
        )}
      </main>
    </div>
  )
}

export default RocketGameScreen
