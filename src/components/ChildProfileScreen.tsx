import type { TherapistChild } from '../data/therapistChildren'
import './ChildProfileScreen.css'

type ChildProfileScreenProps = {
  child: TherapistChild
  onBack: () => void
  onAssignTask: () => void
}

function ChildProfileScreen({ child, onBack, onAssignTask }: ChildProfileScreenProps) {
  const totalTasks = child.tasks.length
  const completedTasks = child.tasks.filter((task) => task.completed).length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const recentResults = [
    `Сьогодні — ${completedTasks} / ${totalTasks}`,
    ...child.recentResults.filter((result) => !result.startsWith('Сьогодні')).slice(0, 2),
  ]

  return (
    <main className="child-profile">
      <header className="child-profile__header">
        <button className="child-profile__back" type="button" onClick={onBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
          Назад
        </button>
      </header>

      <section className="child-profile__intro" aria-labelledby="child-profile-title">
        <span className={`child-profile__avatar child-profile__avatar--${child.avatarColor}`} aria-hidden="true">
          {child.name.slice(0, 1)}
        </span>
        <div>
          <h1 id="child-profile-title">{child.name}</h1>
          <p>Тренуємо звук «{child.targetSound}»</p>
        </div>
      </section>

      <section className="daily-progress" aria-labelledby="daily-progress-title">
        <div className="daily-progress__heading">
          <span>Сьогоднішній план</span>
          <span>Прогрес сьогодні</span>
        </div>
        <h2 id="daily-progress-title">
          {completedTasks} з {totalTasks} завдань виконано
        </h2>
        <div className="daily-progress__bar" aria-label={`Виконано ${completedTasks} з ${totalTasks} завдань`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="daily-progress__details">
          <span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.8 2.8c.7 3.4-1.5 4.6-3 6.5-1.2 1.5-1.5 3-.4 4.7.1-2 1.3-3.2 2.7-4.4-.1 2.4 2.2 3.4 2.2 6.1 0 1.5-.9 2.8-2.2 3.5 3.9-.5 6.2-3.2 6.2-6.8 0-4.2-2.7-7.8-5.5-9.6ZM9 9.6c-2.5 1.9-4.3 4.2-4.3 6.8 0 2.4 1.7 4.3 4.2 4.8-1.1-.9-1.8-2.2-1.8-3.7 0-1.7.8-2.8 2-4-.6-1.4-.6-2.7-.1-3.9Z" />
            </svg>
            {child.streak} поспіль
          </span>
          <span>Остання активність: {child.lastActivity}</span>
        </div>
      </section>

      <section className="profile-tasks" aria-labelledby="profile-tasks-title">
        <div className="profile-section-heading">
          <h2 id="profile-tasks-title">Завдання на сьогодні</h2>
          <span>{totalTasks} завдань</span>
        </div>
        <div className="profile-tasks__list">
          {child.tasks.map((task) => (
            <article className="profile-task-card" key={task.id}>
              <span className="profile-task-card__icon" aria-hidden="true">{task.icon}</span>
              <div>
                <h3>{task.title}</h3>
                <p>Звук «{task.targetSound}»</p>
              </div>
              <span className={`task-status task-status--${task.completed ? 'completed' : 'pending'}`}>
                {task.completed ? 'Виконано' : 'Ще не виконано'}
              </span>
            </article>
          ))}
        </div>
      </section>

      <button className="assign-task-button" type="button" onClick={onAssignTask}>+ Призначити завдання</button>

      <section className="recent-results" aria-labelledby="recent-results-title">
        <div className="profile-section-heading">
          <h2 id="recent-results-title">Останні результати</h2>
        </div>
        <div className="recent-results__list">
          {recentResults.map((result) => (
            <p key={result}>
              <span />
              {result}
            </p>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ChildProfileScreen
