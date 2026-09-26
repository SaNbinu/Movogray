import BottomNavigation from './BottomNavigation'
import TodayMissionCard from './TodayMissionCard'
import type { TherapistChild, TherapistTask } from '../data/therapistChildren'

type ChildHomeScreenProps = {
  child: TherapistChild
  onChangeRole: () => void
  onChangeProfile: () => void
  onStartTask: (task: TherapistTask) => void
}

function ChildHomeScreen({
  child,
  onChangeRole,
  onChangeProfile,
  onStartTask,
}: ChildHomeScreenProps) {
  const rocketTask = child.tasks.find((task) => task.type === 'rocket' && !task.completed) ?? null

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand" aria-label="Мовограй">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <path className="brand__bubble" d="M8 7h32a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H24l-10 7v-7H8a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4Z" />
              <path className="brand__wave" d="M13 25v-6m7 10V15m8 12V17m7 8v-6" />
            </svg>
          </span>
          <span className="brand__name">Мовограй</span>
        </div>

        <div className="app-header__actions">
          <div className="header-score" aria-label={`${child.points} очок`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 3 2.7 5.4 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9Z" />
            </svg>
            <strong>{child.points}</strong>
          </div>
          <button className="role-switch-button" type="button" onClick={onChangeRole}>
            Змінити роль
          </button>
        </div>
      </header>

      <main>
        <section className="welcome-section" aria-labelledby="welcome-title">
          <div className="welcome-section__profile-action">
            <button className="profile-switch-button" type="button" onClick={onChangeProfile}>
              Змінити профіль
            </button>
          </div>
          <h1 id="welcome-title">Привіт, {child.name}! 👋</h1>
          <p>Час для короткої мовної пригоди. Почнімо з головної місії.</p>
        </section>

        <TodayMissionCard
          task={rocketTask}
          onStart={() => {
            if (rocketTask) {
              onStartTask(rocketTask)
            }
          }}
        />

        <section className="stats-grid" aria-label="Твої результати">
          <article className="stat-card stat-card--points">
            <span className="stat-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m12 3 2.7 5.4 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9Z" />
              </svg>
            </span>
            <span className="stat-card__label">Твої очки</span>
            <strong>{child.points}</strong>
          </article>

          <article className="stat-card stat-card--streak">
            <span className="stat-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M13.8 2.8c.7 3.4-1.5 4.6-3 6.5-1.2 1.5-1.5 3-.4 4.7.1-2 1.3-3.2 2.7-4.4-.1 2.4 2.2 3.4 2.2 6.1 0 1.5-.9 2.8-2.2 3.5 3.9-.5 6.2-3.2 6.2-6.8 0-4.2-2.7-7.8-5.5-9.6ZM9 9.6c-2.5 1.9-4.3 4.2-4.3 6.8 0 2.4 1.7 4.3 4.2 4.8-1.1-.9-1.8-2.2-1.8-3.7 0-1.7.8-2.8 2-4-.6-1.4-.6-2.7-.1-3.9Z" />
              </svg>
            </span>
            <span className="stat-card__label">Днів поспіль</span>
            <strong>{child.streak}</strong>
          </article>
        </section>

        <section className="child-tasks" aria-labelledby="child-tasks-title">
          <div className="section-heading">
            <h2 id="child-tasks-title">Завдання на сьогодні</h2>
            <span>{child.tasks.length} завдань</span>
          </div>
          <div className="child-tasks__list">
            {child.tasks.map((task) => (
              <article className="child-task-card" key={task.id}>
                <span className="child-task-card__icon" aria-hidden="true">{task.icon}</span>
                <div>
                  <h3>{task.title}</h3>
                  <p>Звук «{task.targetSound}»</p>
                </div>
                <span className={`child-task-card__status child-task-card__status--${task.completed ? 'completed' : 'pending'}`}>
                  {task.completed ? 'Виконано' : 'Ще не виконано'}
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  )
}

export default ChildHomeScreen
