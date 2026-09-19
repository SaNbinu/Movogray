import { useRef, useState } from 'react'
import BottomNavigation from './components/BottomNavigation'
import RocketGameScreen from './components/RocketGameScreen'
import TodayMissionCard from './components/TodayMissionCard'
import './App.css'

type AppScreen = 'home' | 'rocket-game'

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home')
  const [points, setPoints] = useState(125)
  const [missionCompleted, setMissionCompleted] = useState(false)
  const rewardClaimedRef = useRef(false)

  function handleMissionComplete() {
    if (rewardClaimedRef.current) {
      return
    }

    rewardClaimedRef.current = true
    setPoints((currentPoints) => currentPoints + 25)
    setMissionCompleted(true)
  }

  if (currentScreen === 'rocket-game') {
    return (
      <RocketGameScreen
        onBack={() => setCurrentScreen('home')}
        onMissionComplete={handleMissionComplete}
      />
    )
  }

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

        <div className="header-score" aria-label={`${points} очок`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m12 3 2.7 5.4 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9Z" />
          </svg>
          <strong>{points}</strong>
        </div>
      </header>

      <main>
        <section className="welcome-section" aria-labelledby="welcome-title">
          <h1 id="welcome-title">Привіт, Максиме! 👋</h1>
          <p>Час для короткої мовної пригоди. Почнімо з головної місії.</p>
        </section>

        <TodayMissionCard
          isCompleted={missionCompleted}
          onStart={() => setCurrentScreen('rocket-game')}
        />

        <section className="stats-grid" aria-label="Твої результати">
          <article className="stat-card stat-card--points">
            <span className="stat-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m12 3 2.7 5.4 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9Z" />
              </svg>
            </span>
            <span className="stat-card__label">Твої очки</span>
            <strong>{points}</strong>
          </article>

          <article className="stat-card stat-card--streak">
            <span className="stat-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M13.8 2.8c.7 3.4-1.5 4.6-3 6.5-1.2 1.5-1.5 3-.4 4.7.1-2 1.3-3.2 2.7-4.4-.1 2.4 2.2 3.4 2.2 6.1 0 1.5-.9 2.8-2.2 3.5 3.9-.5 6.2-3.2 6.2-6.8 0-4.2-2.7-7.8-5.5-9.6ZM9 9.6c-2.5 1.9-4.3 4.2-4.3 6.8 0 2.4 1.7 4.3 4.2 4.8-1.1-.9-1.8-2.2-1.8-3.7 0-1.7.8-2.8 2-4-.6-1.4-.6-2.7-.1-3.9Z" />
              </svg>
            </span>
            <span className="stat-card__label">Днів поспіль</span>
            <strong>3</strong>
          </article>
        </section>

        <section className="other-games" aria-labelledby="other-games-title">
          <div className="section-heading">
            <h2 id="other-games-title">Інші ігри</h2>
            <span>Незабаром</span>
          </div>

          <div className="game-list">
            <article className="game-card" aria-disabled="true">
              <div className="game-card__visual game-card__visual--words" aria-hidden="true">
                <svg viewBox="0 0 180 120">
                  <path className="preview-blob" d="M26 25C45 4 82 9 101 22s39 11 49 34-3 51-27 57-37-10-57-6-46-7-52-30c-5-19 0-37 12-52Z" />
                  <path className="preview-card" d="M36 30h74a10 10 0 0 1 10 10v34a10 10 0 0 1-10 10H72L51 98V84H36a10 10 0 0 1-10-10V40a10 10 0 0 1 10-10Z" />
                  <text x="48" y="65">РА</text>
                  <path className="preview-accent" d="M133 47c9 7 9 20 0 27m10-37c17 13 17 34 0 47" />
                </svg>
              </div>
              <h3>Повтори слово</h3>
              <p>Тренуй чітку вимову</p>
              <span className="game-card__status">Незабаром</span>
            </article>

            <article className="game-card" aria-disabled="true">
              <div className="game-card__visual game-card__visual--sound" aria-hidden="true">
                <svg viewBox="0 0 180 120">
                  <circle className="preview-blob" cx="91" cy="60" r="52" />
                  <path className="preview-wave" d="M43 64h9l7-20 11 39 10-31 10 22 7-13h14" />
                  <circle className="preview-lens" cx="104" cy="57" r="29" />
                  <path className="preview-handle" d="m125 79 22 22" />
                  <circle className="preview-dot" cx="49" cy="30" r="5" />
                </svg>
              </div>
              <h3>Знайди звук</h3>
              <p>Слухай та обирай</p>
              <span className="game-card__status">Незабаром</span>
            </article>

            <article className="game-card" aria-disabled="true">
              <div className="game-card__visual game-card__visual--breath" aria-hidden="true">
                <svg viewBox="0 0 180 120">
                  <path className="preview-blob" d="M30 42c13-28 55-37 82-26s54 34 42 62-51 35-82 28-55-36-42-64Z" />
                  <path className="preview-feather" d="M113 22c-32 6-55 29-58 65 24-6 49-22 58-65Z" />
                  <path className="preview-feather-line" d="M106 30 53 96m16-43 21 1M60 69l15 1m16-29 5 16m-19-4 3 14" />
                  <path className="preview-breeze" d="M23 83c10-6 19-6 28 0m-20 13c14-5 26-4 36 2" />
                </svg>
              </div>
              <h3>Легке дихання</h3>
              <p>Виконуй вправи разом</p>
              <span className="game-card__status">Незабаром</span>
            </article>
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  )
}

export default App
