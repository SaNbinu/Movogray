import { useState } from 'react'
import type { TherapistChild } from '../data/therapistChildren'
import './AddChildScreen.css'

type AddChildScreenProps = {
  onBack: () => void
  onAdd: (child: Pick<TherapistChild, 'name' | 'targetSound'>) => void
}

const sounds = ['Р', 'С', 'Ш', 'Щ', 'Л', 'З']

function AddChildScreen({ onBack, onAdd }: AddChildScreenProps) {
  const [name, setName] = useState('')
  const [targetSound, setTargetSound] = useState('Р')
  const [nameError, setNameError] = useState('')

  function handleSubmit() {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setNameError('Введіть ім’я дитини')
      return
    }

    onAdd({ name: trimmedName, targetSound })
  }

  return (
    <main className="add-child">
      <header className="add-child__header">
        <button className="add-child__back" type="button" onClick={onBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
          Назад
        </button>
      </header>

      <section className="add-child__intro" aria-labelledby="add-child-title">
        <h1 id="add-child-title">Додати дитину</h1>
        <p>Створіть профіль дитини, щоб призначати їй завдання</p>
      </section>

      <section className="add-child__section" aria-labelledby="child-name-label">
        <label id="child-name-label" htmlFor="child-name">Ім’я дитини</label>
        <input
          className={nameError ? 'add-child__input add-child__input--error' : 'add-child__input'}
          id="child-name"
          type="text"
          value={name}
          placeholder="Наприклад, Максим"
          onChange={(event) => {
            setName(event.target.value)
            if (nameError) {
              setNameError('')
            }
          }}
          aria-describedby={nameError ? 'child-name-error' : undefined}
          aria-invalid={Boolean(nameError)}
        />
        {nameError && <p className="add-child__error" id="child-name-error">{nameError}</p>}
      </section>

      <section className="add-child__section" aria-labelledby="training-sound-title">
        <h2 id="training-sound-title">Звук для тренування</h2>
        <div className="add-child__chips" aria-label="Оберіть звук для тренування">
          {sounds.map((sound) => (
            <button
              className={sound === targetSound ? 'add-child__chip add-child__chip--selected' : 'add-child__chip'}
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

      <button className="add-child__submit" type="button" onClick={handleSubmit}>
        Додати дитину
      </button>
    </main>
  )
}

export default AddChildScreen
