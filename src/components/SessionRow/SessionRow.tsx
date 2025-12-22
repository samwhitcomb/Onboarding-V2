import React, { useRef } from 'react'
import { Session } from '../../data/sessionTypes'
import { SessionCard } from '../SessionCard/SessionCard'
import './SessionRow.css'

interface SessionRowProps {
  title: string
  description?: string
  sessions: Session[]
  onSessionClick?: (session: Session) => void
  showArrows?: boolean
}

export const SessionRow: React.FC<SessionRowProps> = ({
  title,
  description,
  sessions,
  onSessionClick,
  showArrows = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 600
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === 'right' ? scrollAmount : -scrollAmount)
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      })
    }
  }

  if (sessions.length === 0) {
    return null
  }

  return (
    <div className="session-row">
      <div className="session-row__header">
        <div className="session-row__header-content">
          <h2 className="session-row__title">{title}</h2>
          {description && (
            <p className="session-row__description">{description}</p>
          )}
        </div>
        {showArrows && (
          <div className="session-row__controls">
            <button
              className="session-row__arrow session-row__arrow--left"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              className="session-row__arrow session-row__arrow--right"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="session-row__container" ref={scrollContainerRef}>
        <div className="session-row__content">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onClick={() => onSessionClick?.(session)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


