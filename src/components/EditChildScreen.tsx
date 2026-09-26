import { useState } from 'react'
import type { TherapistChild } from '../data/therapistChildren'
import './AddChildScreen.css'

type EditChildScreenProps = {
  child: TherapistChild
  onBack: () => void
  onSave: (updates: Pick<TherapistChild, 'name' | 'targetSound'>) => void
}

const sounds = ['Р', 'С', 'Ш', 'Щ', 'Л', 'З']

function EditChildScreen({ child, onBack, onSave }: EditChildScreenProps) {
  const [name, setName] = useState(child.name)
  const [targetSound, setTargetSound] = useState(child.targetSound)
  const [nameError, setNameError] = useState('')

  function handleSubmit() {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setNameError('Введіть ім’я дитини')
      return
    }

    onSave({ name: trimmedName, targetSound })
  }

  return (
    <main className="add-child">
      <header className="add-child__header">
        <button className="add-child__back" type="button" onClick={onBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
          Назад
        </button>
      </header>

      <section className="add-child__intro" aria-labelledby="edit-child-title">
        <h1 id="edit-child-title">Редагувати профіль</h1>
        <p>Оновіть дані дитини</p>
      </section>

      <section className="add-child__section" aria-labelledby="edit-child-name-label">
        <label id="edit-child-name-label" htmlFor="edit-child-name">Ім’я дитини</label>
        <input
          className={nameError ? 'add-child__input add-child__input--error' : 'add-child__input'}
          id="edit-child-name"
          type="text"
          value={name}
          placeholder="Наприклад, Максим"
          onChange={(event) => {
            setName(event.target.value)
            if (nameError) {
              setNameError('')
            }
          }}
          aria-describedby={nameError ? 'edit-child-name-error' : undefined}
          aria-invalid={Boolean(nameError)}
        />
        {nameError && <p className="add-child__error" id="edit-child-name-error">{nameError}</p>}
      </section>

      <section className="add-child__section" aria-labelledby="edit-training-sound-title">
        <h2 id="edit-training-sound-title">Звук для тренування</h2>
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
        Зберегти зміни
      </button>
    </main>
  )
}

export default EditChildScreen
