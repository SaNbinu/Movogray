import './RocketGameScreen.css'

type RocketGameScreenProps = {
  onBack: () => void
}

function RocketGameScreen({ onBack }: RocketGameScreenProps) {
  return (
    <div className="rocket-game-shell">
      <header className="rocket-game-header">
        <button
          className="rocket-game-header__back"
          type="button"
          onClick={onBack}
          aria-label="Повернутися на головну"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 5-7 7 7 7" />
          </svg>
        </button>

        <div className="rocket-game-header__title">
          <h1>Запусти ракету</h1>
          <p>Тренуємо звук «Р»</p>
        </div>

        <span className="rocket-game-header__step" aria-label="Перше завдання з п'яти">
          1 / 5
        </span>
      </header>

      <main className="rocket-game-content">
        <section className="space-stage" aria-label="Ігрове поле з ракетою">
          <span className="space-stage__glow" aria-hidden="true" />
          <span className="space-stage__orbit" aria-hidden="true" />
          <span className="space-stage__planet" aria-hidden="true" />
          <span className="space-star space-star--one" aria-hidden="true" />
          <span className="space-star space-star--two" aria-hidden="true" />
          <span className="space-star space-star--three" aria-hidden="true" />
          <span className="space-star space-star--four" aria-hidden="true" />
          <span className="space-star space-star--five" aria-hidden="true" />
          <span className="space-star space-star--six" aria-hidden="true" />

          <div className="rocket-flight-path">
            <div className="rocket-position">
              <svg className="game-rocket" viewBox="0 0 190 230" aria-hidden="true">
                <defs>
                  <linearGradient id="game-rocket-body" x1="72" y1="44" x2="124" y2="142" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" />
                    <stop offset="0.56" stopColor="#f2f3ff" />
                    <stop offset="1" stopColor="#cbd1fb" />
                  </linearGradient>
                  <linearGradient id="game-rocket-flame" x1="95" y1="143" x2="95" y2="210" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fff59b" />
                    <stop offset="0.42" stopColor="#ffc24e" />
                    <stop offset="1" stopColor="#ff6b5c" stopOpacity="0" />
                  </linearGradient>
                  <filter id="game-rocket-shadow" x="20" y="0" width="150" height="225" filterUnits="userSpaceOnUse">
                    <feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="#130d50" floodOpacity="0.34" />
                  </filter>
                </defs>
                <g filter="url(#game-rocket-shadow)">
                  <path className="game-rocket__flame" d="M82 144c-6 24 2 47 13 65 11-18 19-41 13-65H82Z" />
                  <path className="game-rocket__inner-flame" d="M90 145c-2 15 0 29 5 40 5-11 7-25 5-40H90Z" />
                  <path className="game-rocket__left-wing" d="M73 101c-17 10-24 28-22 51l31-18-9-33Z" />
                  <path className="game-rocket__right-wing" d="M117 101c17 10 24 28 22 51l-31-18 9-33Z" />
                  <path className="game-rocket__body" d="M95 18c26 22 36 61 27 99l-13 29H81l-13-29c-9-38 1-77 27-99Z" />
                  <path className="game-rocket__nose" d="M95 18c11 9 19 21 24 35H71c5-14 13-26 24-35Z" />
                  <path className="game-rocket__panel" d="M81 122h28l-4 14H85l-4-14Z" />
                  <circle className="game-rocket__window-frame" cx="95" cy="79" r="20" />
                  <circle className="game-rocket__window" cx="95" cy="79" r="13" />
                  <path className="game-rocket__shine" d="M89 74c3-4 7-5 11-3" />
                </g>
              </svg>
            </div>
          </div>

          <div className="launch-platform" aria-hidden="true">
            <span />
          </div>
        </section>

        <section className="game-instruction" aria-labelledby="game-instruction-title">
          <span className="game-instruction__sound" aria-hidden="true">Р</span>
          <h2 id="game-instruction-title">
            Тягни звук «Р-р-р...» 3 секунди, щоб ракета злетіла
          </h2>
        </section>

        <section className="mission-progress" aria-label="Прогрес місії: одне з п'яти завдань">
          <div className="mission-progress__heading">
            <span>Прогрес місії</span>
            <strong>1 з 5</strong>
          </div>
          <div className="mission-progress__steps" aria-hidden="true">
            <span className="mission-progress__step mission-progress__step--active" />
            <span className="mission-progress__step" />
            <span className="mission-progress__step" />
            <span className="mission-progress__step" />
            <span className="mission-progress__step" />
          </div>
        </section>

        <button className="hold-sound-button" type="button" aria-describedby="demo-mode-note">
          <svg viewBox="0 0 30 30" aria-hidden="true">
            <circle cx="15" cy="15" r="4" />
            <path d="M8.8 8.8a8.8 8.8 0 0 0 0 12.4m12.4 0a8.8 8.8 0 0 0 0-12.4M5 5a14.1 14.1 0 0 0 0 20m20 0a14.1 14.1 0 0 0 0-20" />
          </svg>
          Утримуй звук
        </button>
        <p className="demo-mode-note" id="demo-mode-note">
          Демо-режим: кнопка поки не використовує мікрофон
        </p>
      </main>
    </div>
  )
}

export default RocketGameScreen
