import { useState } from 'react'
import type { NewTherapistTask, TherapistChild } from '../data/therapistChildren'
import './AssignTaskScreen.css'

type AssignTaskScreenProps = {
  child: TherapistChild
  onBack: () => void
  onAssign: (task: NewTherapistTask) => void
}

const sounds = ['Р', 'С', 'Ш', 'Щ', 'Л', 'З']
const repetitions = [3, 5, 10] as const
const durations = [2, 3, 5] as const

function AssignTaskScreen({ child, onBack, onAssign }: AssignTaskScreenProps) {
  const [targetSound, setTargetSound] = useState(child.targetSound)
  const [repetitionCount, setRepetitionCount] = useState<3 | 5 | 10>(5)
  const [durationSeconds, setDurationSeconds] = useState<2 | 3 | 5>(3)

  function handleAssign() {
    onAssign({
      type: 'rocket',
      title: 'Запусти ракету',
      icon: '🚀',
      targetSound,
      repetitions: repetitionCount,
      durationSeconds,
    })
  }

  return (
    <main className="assign-task">
      <header className="assign-task__header">
        <button className="assign-task__back" type="button" onClick={onBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
          Назад
        </button>
      </header>

      <section className="assign-task__intro" aria-labelledby="assign-task-title">
        <p>Нове завдання</p>
        <h1 id="assign-task-title">Для: {child.name}</h1>
        <span>Тренуємо звук «{child.targetSound}»</span>
      </section>

      <section className="assign-task__section" aria-labelledby="exercise-title">
        <h2 id="exercise-title">Оберіть вправу</h2>
        <div className="exercise-list">
          <button className="exercise-card exercise-card--selected" type="button" aria-pressed="true">
            <span className="exercise-card__icon" aria-hidden="true">🚀</span>
            <span className="exercise-card__content">
              <strong>Запусти ракету</strong>
              <small>Тягни звук протягом заданого часу</small>
            </span>
            <span className="exercise-card__check" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="m5 12 4.5 4.5L19 7" /></svg>
            </span>
          </button>
          <button className="exercise-card exercise-card--disabled" type="button" disabled>
            <span className="exercise-card__icon" aria-hidden="true">🎯</span>
            <span className="exercise-card__content">
              <strong>Повтори слова</strong>
              <small>Повторюй слова з потрібним звуком</small>
            </span>
            <span className="exercise-card__soon">Скоро</span>
          </button>
          <button className="exercise-card exercise-card--disabled" type="button" disabled>
            <span className="exercise-card__icon" aria-hidden="true">🎤</span>
            <span className="exercise-card__content">
              <strong>Потягни звук</strong>
              <small>Утримуй звук якомога рівніше</small>
            </span>
            <span className="exercise-card__soon">Скоро</span>
          </button>
        </div>
      </section>

      <section className="assign-task__section" aria-labelledby="sound-title">
        <h2 id="sound-title">Звук</h2>
        <div className="option-chips" aria-label="Оберіть звук">
          {sounds.map((sound) => (
            <button
              className={sound === targetSound ? 'option-chip option-chip--selected' : 'option-chip'}
              type="button"
              key={sound}
              onClick={() => setTargetSound(sound)}
              aria-pressed={sound === targetSound}
            >
              {sound}
            </button>
          ))}
        </div>
      </section>

      <section className="assign-task__section" aria-labelledby="repetitions-title">
        <h2 id="repetitions-title">Кількість повторень</h2>
        <div className="option-chips" aria-label="Оберіть кількість повторень">
          {repetitions.map((count) => (
            <button
              className={count === repetitionCount ? 'option-chip option-chip--selected' : 'option-chip'}
              type="button"
              key={count}
              onClick={() => setRepetitionCount(count)}
              aria-pressed={count === repetitionCount}
            >
              {count}
            </button>
          ))}
        </div>
      </section>

      <section className="assign-task__section" aria-labelledby="duration-title">
        <h2 id="duration-title">Тривалість одного повтору</h2>
        <div className="option-chips" aria-label="Оберіть тривалість повтору">
          {durations.map((duration) => (
            <button
              className={duration === durationSeconds ? 'option-chip option-chip--selected' : 'option-chip'}
              type="button"
              key={duration}
              onClick={() => setDurationSeconds(duration)}
              aria-pressed={duration === durationSeconds}
            >
              {duration} сек
            </button>
          ))}
        </div>
      </section>

      <button className="assign-task__submit" type="button" onClick={handleAssign}>
        Призначити завдання
      </button>
    </main>
  )
}

export default AssignTaskScreen
