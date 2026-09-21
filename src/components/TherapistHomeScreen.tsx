import './TherapistHomeScreen.css'

type TherapistHomeScreenProps = {
  onChangeRole: () => void
}

const children = [
  { name: 'Максим', sound: 'Р', streak: '3 дні', completed: 4, total: 5, color: 'blue' },
  { name: 'Софія', sound: 'С', streak: '5 днів', completed: 5, total: 5, color: 'purple' },
  { name: 'Артем', sound: 'Ш', streak: '1 день', completed: 2, total: 5, color: 'mint' },
]

function TherapistHomeScreen({ onChangeRole }: TherapistHomeScreenProps) {
  return (
    <main className="therapist-home">
      <header className="therapist-home__header">
        <div className="therapist-brand" aria-label="Мовограй">
          <span className="therapist-brand__mark" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <path d="M8 7h32a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H24l-10 7v-7H8a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4Z" />
              <path d="M13 25v-6m7 10V15m8 12V17m7 8v-6" />
            </svg>
          </span>
          <span>Мовограй</span>
        </div>
        <button className="therapist-home__role-switch" type="button" onClick={onChangeRole}>
          Змінити роль
        </button>
      </header>

      <section className="therapist-home__welcome" aria-labelledby="therapist-welcome-title">
        <h1 id="therapist-welcome-title">Добрий день! 👋</h1>
        <p>Ось як справи у ваших дітей сьогодні</p>
      </section>

      <section className="therapist-stats" aria-label="Загальна статистика">
        <article className="therapist-stat therapist-stat--children">
          <span>Дітей у роботі</span>
          <strong>3 дитини</strong>
        </article>
        <article className="therapist-stat therapist-stat--tasks">
          <span>Сьогодні</span>
          <strong>11 / 15</strong>
          <small>завдань виконано</small>
        </article>
      </section>

      <section className="children-section" aria-labelledby="children-title">
        <div className="children-section__heading">
          <h2 id="children-title">Ваші діти</h2>
          <span>Сьогодні</span>
        </div>

        <div className="children-list">
          {children.map((child) => {
            const progress = (child.completed / child.total) * 100

            return (
              <article className="child-card" key={child.name}>
                <div className={`child-card__avatar child-card__avatar--${child.color}`} aria-hidden="true">
                  {child.name.slice(0, 1)}
                </div>
                <div className="child-card__content">
                  <div className="child-card__topline">
                    <h3>{child.name}</h3>
                    <span className="child-card__sound">Звук {child.sound}</span>
                  </div>
                  <div className="child-card__details">
                    <span>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M13.8 2.8c.7 3.4-1.5 4.6-3 6.5-1.2 1.5-1.5 3-.4 4.7.1-2 1.3-3.2 2.7-4.4-.1 2.4 2.2 3.4 2.2 6.1 0 1.5-.9 2.8-2.2 3.5 3.9-.5 6.2-3.2 6.2-6.8 0-4.2-2.7-7.8-5.5-9.6ZM9 9.6c-2.5 1.9-4.3 4.2-4.3 6.8 0 2.4 1.7 4.3 4.2 4.8-1.1-.9-1.8-2.2-1.8-3.7 0-1.7.8-2.8 2-4-.6-1.4-.6-2.7-.1-3.9Z" />
                      </svg>
                      {child.streak}
                    </span>
                    <strong>{child.completed} / {child.total}</strong>
                  </div>
                  <div className="child-card__progress" aria-label={`Виконано ${child.completed} з ${child.total} завдань`}>
                    <span style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <button className="add-child-button" type="button">+ Додати дитину</button>
    </main>
  )
}

export default TherapistHomeScreen
