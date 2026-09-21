import type { TherapistTask } from '../data/therapistChildren'

type TodayMissionCardProps = {
  task: TherapistTask | null
  isCompleted: boolean
  onStart: () => void
}

function TodayMissionCard({ task, isCompleted, onStart }: TodayMissionCardProps) {
  const isEmpty = task === null

  return (
    <article
      className={`mission-card${isCompleted && !isEmpty ? ' mission-card--completed' : ''}${isEmpty ? ' mission-card--empty' : ''}`}
      aria-labelledby="mission-title"
    >
      <div className="mission-card__content">
        <p className="mission-card__eyebrow">
          {isEmpty ? 'На сьогодні все' : isCompleted ? 'Сьогодні виконано' : 'Сьогоднішня місія'}
        </p>
        <h2 id="mission-title">{task?.title ?? 'Усі завдання виконано! 🎉'}</h2>
        <p className="mission-card__description">
          {isEmpty
            ? 'Нових ігор поки немає. Завітай трохи пізніше.'
            : isCompleted
            ? 'Усі вправи зі звуком виконано. Чудова робота!'
            : 'Виконай вправи зі звуком і допоможи ракеті дістатися зірок.'}
        </p>

        {task && (
          <div className="mission-card__details" aria-label="Параметри завдання">
            <span className="sound-badge">
              Звук <strong>{task.targetSound}</strong>
            </span>
            <span className="task-count">{task.repetitions} повторень · {task.durationSeconds} с</span>
          </div>
        )}
      </div>

      <div className="mission-visual" aria-hidden="true">
        <span className="mission-star mission-star--one" />
        <span className="mission-star mission-star--two" />
        <span className="mission-star mission-star--three" />
        <span className="mission-star mission-star--four" />
        <span className="mission-orbit" />
        <span className="mission-planet" />
        <svg className="rocket-illustration" viewBox="0 0 190 230">
          <defs>
            <linearGradient id="rocket-body" x1="72" y1="44" x2="124" y2="142" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="0.56" stopColor="#f2f3ff" />
              <stop offset="1" stopColor="#cbd1fb" />
            </linearGradient>
            <linearGradient id="rocket-flame" x1="95" y1="143" x2="95" y2="202" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff59b" />
              <stop offset="0.45" stopColor="#ffc24e" />
              <stop offset="1" stopColor="#ff6b5c" stopOpacity="0" />
            </linearGradient>
            <filter id="rocket-shadow" x="20" y="0" width="150" height="220" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="12" stdDeviation="8" floodColor="#171056" floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#rocket-shadow)" transform="rotate(16 95 112)">
            <path className="rocket-illustration__flame" d="M83 144c-5 22 2 43 12 59 10-16 17-37 12-59H83Z" />
            <path className="rocket-illustration__inner-flame" d="M90 145c-2 14 0 27 5 37 5-10 7-23 5-37H90Z" />
            <path className="rocket-illustration__left-wing" d="M73 101c-17 10-24 28-22 51l31-18-9-33Z" />
            <path className="rocket-illustration__right-wing" d="M117 101c17 10 24 28 22 51l-31-18 9-33Z" />
            <path className="rocket-illustration__body" d="M95 18c26 22 36 61 27 99l-13 29H81l-13-29c-9-38 1-77 27-99Z" />
            <path className="rocket-illustration__nose" d="M95 18c11 9 19 21 24 35H71c5-14 13-26 24-35Z" />
            <path className="rocket-illustration__panel" d="M81 122h28l-4 14H85l-4-14Z" />
            <circle className="rocket-illustration__window-frame" cx="95" cy="79" r="20" />
            <circle className="rocket-illustration__window" cx="95" cy="79" r="13" />
            <path className="rocket-illustration__shine" d="M89 74c3-4 7-5 11-3" />
          </g>
          <circle className="rocket-smoke rocket-smoke--one" cx="75" cy="199" r="13" />
          <circle className="rocket-smoke rocket-smoke--two" cx="98" cy="207" r="17" />
          <circle className="rocket-smoke rocket-smoke--three" cx="121" cy="198" r="11" />
        </svg>
      </div>

      {task && isCompleted ? (
        <div className="mission-card__completed-status" role="status">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12.5 4.2 4.2L19 7" />
          </svg>
          Місію завершено
        </div>
      ) : task ? (
        <button className="mission-card__button" type="button" onClick={onStart}>
          Почати гру
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      ) : null}
    </article>
  )
}

export default TodayMissionCard
