import React, { useState } from 'react'
import './LauncherNav.css'

type NavSection = 'sessions' | 'play' | 'profile'

interface LauncherNavProps {
  activeSection?: NavSection
  onSectionChange?: (section: NavSection) => void
}

export const LauncherNav: React.FC<LauncherNavProps> = ({
  activeSection = 'play',
  onSectionChange,
}) => {
  const [active, setActive] = useState<NavSection>(activeSection)

  const handleClick = (section: NavSection) => {
    setActive(section)
    onSectionChange?.(section)
  }

  return (
    <nav className="launcher-nav">
      <button
        className={`launcher-nav__item ${active === 'sessions' ? 'launcher-nav__item--active' : ''}`}
        onClick={() => handleClick('sessions')}
      >
        SESSIONS
      </button>
      <button
        className={`launcher-nav__item ${active === 'play' ? 'launcher-nav__item--active' : ''}`}
        onClick={() => handleClick('play')}
      >
        PLAY
      </button>
      <button
        className={`launcher-nav__item ${active === 'profile' ? 'launcher-nav__item--active' : ''}`}
        onClick={() => handleClick('profile')}
      >
        PROFILE
      </button>
    </nav>
  )
}


