import React, { useState } from 'react'
import {
  Session,
  isRangeSession,
  isCourseplaySession,
  isCombineSession,
  isGameSession,
} from '../../data/sessionTypes'
import { getCourseImage, defaultImages } from '../../utils/courseImages'
import { Scorecard } from '../Scorecard/Scorecard'
import { ClubCircles } from '../ClubCircles/ClubCircles'
import { DeleteConfirmation } from '../DeleteConfirmation/DeleteConfirmation'
import './SessionCard.css'

interface SessionCardProps {
  session: Session
  onClick?: () => void
  onDelete?: (sessionId: string) => void
  variant?: 'compact' | 'detailed'
  isSampleData?: boolean
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onClick,
  onDelete,
  variant = 'compact',
  isSampleData = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(session.id)
    }
    setShowDeleteConfirm(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  const formatDate = (date: Date): string => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getSessionImage = (): string => {
    if (isCourseplaySession(session)) {
      return getCourseImage(session.courseId)
    }
    // Default images for other types
    return defaultImages.range
  }

  const getSessionTitle = (): string => {
    if (isCourseplaySession(session)) {
      return session.courseName
    }
    if (isRangeSession(session)) {
      return session.type === 'target-range' ? 'Target Range' : 'Practice Range'
    }
    if (isCombineSession(session)) {
      return 'Combine Assessment'
    }
    if (isGameSession(session)) {
      return session.type === 'closest-to-pin' ? 'Closest to Pin' : 'Longest Drive'
    }
    return 'Session'
  }

  const getKeyStats = (): React.ReactNode => {
    if (isCourseplaySession(session)) {
      // No stats on mini card - scorecard shows all the info
      return null
    }
    
    if (isRangeSession(session) && session.type === 'target-range' && session.strokesGained) {
      return (
        <div className="session-card__stats">
          <div className="session-card__stat session-card__stat--highlight">
            <span className="session-card__stat-label">Strokes Gained</span>
            <span className="session-card__stat-value session-card__stat-value--sg">
              {session.strokesGained > 0 ? '+' : ''}{session.strokesGained.toFixed(1)}
            </span>
          </div>
          <div className="session-card__stat">
            <span className="session-card__stat-label">Shots</span>
            <span className="session-card__stat-value">{session.shotCount}</span>
          </div>
        </div>
      )
    }

    if (isRangeSession(session) && session.type === 'practice-range') {
      return (
        <div className="session-card__stats">
          <div className="session-card__stat">
            <span className="session-card__stat-label">Shots</span>
            <span className="session-card__stat-value">{session.shotCount}</span>
          </div>
          <div className="session-card__stat">
            <span className="session-card__stat-label">Clubs</span>
            <span className="session-card__stat-value">{session.clubsUsed.length}</span>
          </div>
        </div>
      )
    }

    if (isCombineSession(session)) {
      return (
        <div className="session-card__stats">
          <div className="session-card__stat session-card__stat--highlight">
            <span className="session-card__stat-label">Score</span>
            <span className="session-card__stat-value">{session.totalScore}/{session.maxScore}</span>
          </div>
          <div className="session-card__stat">
            <span className="session-card__stat-label">Consistency</span>
            <span className="session-card__stat-value">{session.consistency}%</span>
          </div>
        </div>
      )
    }

    if (isGameSession(session)) {
      const unit = session.type === 'closest-to-pin' ? 'ft' : 'yds'
      return (
        <div className="session-card__stats">
          <div className="session-card__stat session-card__stat--highlight">
            <span className="session-card__stat-label">Best</span>
            <span className="session-card__stat-value">{session.bestResult}{unit}</span>
          </div>
          <div className="session-card__stat">
            <span className="session-card__stat-label">Attempts</span>
            <span className="session-card__stat-value">{session.attempts}</span>
          </div>
        </div>
      )
    }

    return null
  }

  const getWeatherIcon = (): string | null => {
    if (isCourseplaySession(session) && session.weather) {
      switch (session.weather.condition) {
        case 'sunny': return '☀️'
        case 'cloudy': return '☁️'
        case 'rain': return '🌧️'
        default: return null
      }
    }
    return null
  }

  // Generate Pro Insight tag (randomly for demo - in production, use actual correlation)
  const getProInsight = (): string | null => {
    if (isCourseplaySession(session) && !session.isSimulator && Math.random() > 0.6) {
      return 'Your practice SG showed up here: 12/18 fairways!'
    }
    if (isRangeSession(session) && session.type === 'target-range' && session.strokesGained && session.strokesGained > 2) {
      return 'Peak performance - recommended for pre-round warmup'
    }
    return null
  }

  const proInsight = getProInsight()

  const isCourseplay = isCourseplaySession(session)
  const showProInsight = Boolean(proInsight) && !isCourseplay
  const cardTypeClass = isCourseplay ? 'session-card--course' : 'session-card--standard'
  
  return (
    <div
      className={`session-card ${session.isSimulator ? 'session-card--simulator' : 'session-card--live'} ${
        isHovered ? 'session-card--hovered' : ''
      } ${isCourseplay ? 'session-card--courseplay' : ''} ${cardTypeClass} session-card--${variant}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="session-card__image-container">
        <img
          src={getSessionImage()}
          alt={getSessionTitle()}
          className="session-card__image"
        />
        <div className="session-card__overlay" />
        
        {!session.isSimulator && (
          <div className="session-card__live-badge">LIVE</div>
        )}

        {isSampleData && (
          <div className="session-card__sample-badge">Sample Data</div>
        )}

        {isGameSession(session) && session.isPersonalBest && (
          <div className="session-card__pb-ribbon">New PB!</div>
        )}

        {isSampleData && isHovered && onDelete && (
          <button
            className="session-card__delete-button"
            onClick={handleDeleteClick}
            aria-label="Delete session"
            title="Delete sample data"
          >
            ×
          </button>
        )}

        {isCourseplaySession(session) && session.weather && (
          <div className="session-card__weather-badge">
            <span className="session-card__weather-icon">{getWeatherIcon()}</span>
            <span className="session-card__weather-temp">{session.weather.temp}°F</span>
          </div>
        )}
      </div>

      <div className="session-card__content">
        <div className="session-card__header">
          <h3 className="session-card__title">{getSessionTitle()}</h3>
          <div className="session-card__meta">
            <span className="session-card__date">{formatDate(session.date)}</span>
            <span className="session-card__divider">•</span>
            <span className="session-card__duration">{formatDuration(session.duration)}</span>
          </div>
        </div>

        {getKeyStats()}

        {/* Club Circles for Practice Range, Target Range, and Combine */}
        {(() => {
          if (isRangeSession(session) && (session.type === 'practice-range' || session.type === 'target-range')) {
            return session.clubsUsed && session.clubsUsed.length > 0 ? (
              <div className="session-card__clubs">
                <ClubCircles clubs={session.clubsUsed} />
              </div>
            ) : null
          }
          if (isCombineSession(session)) {
            return session.clubsUsed && session.clubsUsed.length > 0 ? (
              <div className="session-card__clubs">
                <ClubCircles clubs={session.clubsUsed} />
              </div>
            ) : null
          }
          return null
        })()}

        {isCourseplaySession(session) && session.holeScores && session.holePars && (
          <Scorecard
            holeScores={session.holeScores}
            holePars={session.holePars}
            totalScore={session.score}
            totalPar={session.par}
          />
        )}

        {showProInsight && (
          <div className="session-card__insight">
            <span className="session-card__insight-icon">💡</span>
            <span className="session-card__insight-text">{proInsight}</span>
          </div>
        )}
      </div>
      {showDeleteConfirm && (
        <DeleteConfirmation
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          message="Delete this sample data session?"
          title="Delete Session"
        />
      )}
    </div>
  )
}

