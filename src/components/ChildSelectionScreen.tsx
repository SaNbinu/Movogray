import type { TherapistChild } from '../data/therapistChildren'
import './ChildSelectionScreen.css'

type ChildSelectionScreenProps = {
  children: TherapistChild[]
  onSelectChild: (childId: string) => void
  onChangeRole: () => void
}

function ChildSelectionScreen({ children, onSelectChild, onChangeRole }: ChildSelectionScreenProps) {
  return (
    <main className="child-selection">
      <header className="child-selection__header">
        <div className="child-selection__brand" aria-label="Мовограй">
          <span className="child-selection__mark" aria-hidden="true">
            <svg viewBox="0 0 48 48">
              <path d="M8 7h32a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H24l-10 7v-7H8a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4Z" />
              <path d="M13 25v-6m7 10V15m8 12V17m7 8v-6" />
            </svg>
          </span>
          <span>Мовограй</span>
        </div>
        <button className="child-selection__role" type="button" onClick={onChangeRole}>
          Змінити роль
        </button>
      </header>

      <section className="child-selection__intro" aria-labelledby="child-selection-title">
        <h1 id="child-selection-title">Хто сьогодні грає? 👋</h1>
        <p>Обери свій профіль</p>
      </section>

      <div className="child-selection__list">
        {children.map((child) => (
          <button
            className="child-selection-card"
            type="button"
            key={child.id}
            onClick={() => onSelectChild(child.id)}
          >
            <span className={`child-selection-card__avatar child-selection-card__avatar--${child.avatarColor}`} aria-hidden="true">
              {child.name.slice(0, 1)}
            </span>
            <span className="child-selection-card__copy">
              <strong>{child.name}</strong>
              <small>Тренуємо звук «{child.targetSound}»</small>
            </span>
            <span className="child-selection-card__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
            </span>
          </button>
        ))}
      </div>
    </main>
  )
}

export default ChildSelectionScreen
