const navigationItems = [
  {
    label: 'Головна',
    icon: (
      <path d="M3.5 10.8 12 3.9l8.5 6.9v8.3a1.9 1.9 0 0 1-1.9 1.9H5.4a1.9 1.9 0 0 1-1.9-1.9zM9 21v-6.5h6V21" />
    ),
  },
  {
    label: 'Ігри',
    icon: (
      <path d="M8.3 9.3v5.4M5.6 12h5.3m6.2-2.7h.1m2.4 3h.1M7.4 5.5h9.2c2 0 3.8 1.4 4.3 3.4l1 4.4c.8 3.5-3.4 5.7-5.7 2.9l-1.1-1.3H8.9l-1.1 1.3c-2.3 2.8-6.5.6-5.7-2.9l1-4.4c.5-2 2.3-3.4 4.3-3.4Z" />
    ),
  },
  {
    label: 'Прогрес',
    icon: <path d="M4 20V10m6 10V4m6 16v-7m4 7V7" />,
  },
  {
    label: 'Профіль',
    icon: (
      <path d="M12 12a4.3 4.3 0 1 0 0-8.6 4.3 4.3 0 0 0 0 8.6Zm-7.5 8.6c.7-3.6 3.5-5.8 7.5-5.8s6.8 2.2 7.5 5.8" />
    ),
  },
]

function BottomNavigation() {
  return (
    <nav className="bottom-navigation" aria-label="Основна навігація">
      {navigationItems.map((item, index) => (
        <button
          className={`bottom-navigation__item${index === 0 ? ' bottom-navigation__item--active' : ''}`}
          type="button"
          aria-current={index === 0 ? 'page' : undefined}
          key={item.label}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {item.icon}
          </svg>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNavigation
