import './RoleSelectionScreen.css'

type RoleSelectionScreenProps = {
  onSelectRole: (role: 'child' | 'therapist') => void
}

function RoleSelectionScreen({ onSelectRole }: RoleSelectionScreenProps) {
  return (
    <main className="role-selection">
      <div className="role-selection__brand" aria-label="Мовограй">
        <span className="role-selection__mark" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <path d="M8 7h32a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H24l-10 7v-7H8a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4Z" />
            <path d="M13 25v-6m7 10V15m8 12V17m7 8v-6" />
          </svg>
        </span>
        <span>Мовограй</span>
      </div>

      <section className="role-selection__intro" aria-labelledby="role-selection-title">
        <p>Твій простір для мовних пригод</p>
        <h1 id="role-selection-title">Привіт! Я Мовограй 👋</h1>
        <span>Обери, як ти хочеш увійти</span>
      </section>

      <div className="role-selection__cards">
        <button
          className="role-card role-card--child"
          type="button"
          onClick={() => onSelectRole('child')}
        >
          <span className="role-card__icon" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <circle cx="24" cy="15" r="8" />
              <path d="M10 42c1.5-10.2 7-15 14-15s12.5 4.8 14 15" />
              <path d="m16 11 3-5m13 5-3-5" />
            </svg>
          </span>
          <span className="role-card__copy">
            <strong>Я дитина</strong>
            <small>Виконуй завдання та грай</small>
          </span>
          <span className="role-card__arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
          </span>
        </button>

        <button
          className="role-card role-card--therapist"
          type="button"
          onClick={() => onSelectRole('therapist')}
        >
          <span className="role-card__icon" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <circle cx="24" cy="14" r="7" />
              <path d="M11 42c1.8-10 6.9-15 13-15s11.2 5 13 15" />
              <path d="M16 7c3-5 13-5 16 0M24 29v13m-6-7h12" />
            </svg>
          </span>
          <span className="role-card__copy">
            <strong>Я логопед</strong>
            <small>Призначай завдання та стеж за прогресом</small>
          </span>
          <span className="role-card__arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
          </span>
        </button>
      </div>
    </main>
  )
}

export default RoleSelectionScreen
