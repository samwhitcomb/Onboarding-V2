import React from 'react'
import {
  Session,
  isRangeSession,
  isCourseplaySession,
  isCombineSession,
  isGameSession,
} from '../../data/sessionTypes'
import { StrokesGainedChart } from '../StrokesGainedChart/StrokesGainedChart'
import { CombineRadarChart } from '../CombineRadarChart/CombineRadarChart'
import { GPSHeatmap } from '../GPSHeatmap/GPSHeatmap'
import { getCourseImage, defaultImages } from '../../utils/courseImages'
import './SessionDetailModal.css'

interface SessionDetailModalProps {
  session: Session | null
  onClose: () => void
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  onClose,
}) => {
  if (!session) return null

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const getSessionTitle = (): string => {
    if (isCourseplaySession(session)) {
      return session.courseName
    }
    if (isRangeSession(session)) {
      return session.type === 'target-range' ? 'Target Range Session' : 'Practice Range Session'
    }
    if (isCombineSession(session)) {
      return 'Combine Assessment'
    }
    if (isGameSession(session)) {
      return session.type === 'closest-to-pin' ? 'Closest to Pin Challenge' : 'Longest Drive Challenge'
    }
    return 'Session Details'
  }

  const getSessionCourseImage = (): string => {
    if (isCourseplaySession(session)) {
      return getCourseImage(session.courseId)
    }
    return defaultImages.range
  }

  return (
    <div className="session-detail-modal-overlay" onClick={onClose}>
      <div className="session-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="session-detail-modal__close" onClick={onClose}>
          ✕
        </button>

        <div className="session-detail-modal__header">
          <div className="session-detail-modal__header-content">
            <h2 className="session-detail-modal__title">{getSessionTitle()}</h2>
            <div className="session-detail-modal__meta">
              <span className="session-detail-modal__date">
                {formatDate(session.date)} • {formatTime(session.date)}
              </span>
              <div className="session-detail-modal__badges">
                {session.isSimulator ? (
                  <span className="session-detail-modal__badge session-detail-modal__badge--sim">
                    Studio Mode
                  </span>
                ) : (
                  <span className="session-detail-modal__badge session-detail-modal__badge--live">
                    LIVE
                  </span>
                )}
                <span className="session-detail-modal__badge">
                  {session.duration} min
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="session-detail-modal__content">
          {/* Courseplay Session */}
          {isCourseplaySession(session) && (
            <>
              <div className="session-detail-modal__section">
                <h3 className="session-detail-modal__section-title">Scorecard</h3>
                <div className="session-detail-modal__scorecard">
                  <div className="session-detail-modal__score-item">
                    <span className="session-detail-modal__score-label">Score</span>
                    <span className="session-detail-modal__score-value">{session.score}</span>
                  </div>
                  <div className="session-detail-modal__score-item">
                    <span className="session-detail-modal__score-label">Par</span>
                    <span className="session-detail-modal__score-value">{session.par}</span>
                  </div>
                  <div className="session-detail-modal__score-item">
                    <span className="session-detail-modal__score-label">To Par</span>
                    <span className="session-detail-modal__score-value">
                      {session.score - session.par > 0 ? '+' : ''}
                      {session.score - session.par}
                    </span>
                  </div>
                  <div className="session-detail-modal__score-item">
                    <span className="session-detail-modal__score-label">GIR</span>
                    <span className="session-detail-modal__score-value">{session.gir}/18</span>
                  </div>
                  <div className="session-detail-modal__score-item">
                    <span className="session-detail-modal__score-label">Putts</span>
                    <span className="session-detail-modal__score-value">{session.putts}</span>
                  </div>
                  {session.fairwaysHit !== undefined && (
                    <div className="session-detail-modal__score-item">
                      <span className="session-detail-modal__score-label">Fairways</span>
                      <span className="session-detail-modal__score-value">{session.fairwaysHit}/14</span>
                    </div>
                  )}
                </div>
              </div>

              {!session.isSimulator && (
                <div className="session-detail-modal__section">
                  <GPSHeatmap
                    courseImage={getSessionCourseImage()}
                    courseName={session.courseName}
                    shotCount={18}
                  />
                </div>
              )}
            </>
          )}

          {/* Target Range Session */}
          {isRangeSession(session) && session.type === 'target-range' && session.sgBreakdown && session.strokesGained && (
            <div className="session-detail-modal__section">
              <StrokesGainedChart
                data={session.sgBreakdown}
                total={session.strokesGained}
              />
            </div>
          )}

          {/* Practice Range Session */}
          {isRangeSession(session) && session.type === 'practice-range' && (
            <div className="session-detail-modal__section">
              <h3 className="session-detail-modal__section-title">Session Summary</h3>
              <div className="session-detail-modal__stats-grid">
                <div className="session-detail-modal__stat">
                  <span className="session-detail-modal__stat-label">Total Shots</span>
                  <span className="session-detail-modal__stat-value">{session.shotCount}</span>
                </div>
                <div className="session-detail-modal__stat">
                  <span className="session-detail-modal__stat-label">Clubs Used</span>
                  <span className="session-detail-modal__stat-value">{session.clubsUsed.length}</span>
                </div>
              </div>
              <div className="session-detail-modal__clubs">
                <h4 className="session-detail-modal__clubs-title">Clubs</h4>
                <div className="session-detail-modal__clubs-list">
                  {session.clubsUsed.map((club, i) => (
                    <span key={i} className="session-detail-modal__club-badge">
                      {club}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Combine Session */}
          {isCombineSession(session) && (
            <div className="session-detail-modal__section">
              <CombineRadarChart
                data={{
                  accuracy: session.accuracy,
                  distance: session.distance,
                  consistency: session.consistency,
                  shotShape: session.shotShape,
                  trajectoryControl: session.trajectoryControl,
                }}
                totalScore={session.totalScore}
                maxScore={session.maxScore}
              />
            </div>
          )}

          {/* Game Session */}
          {isGameSession(session) && (
            <div className="session-detail-modal__section">
              <h3 className="session-detail-modal__section-title">Challenge Results</h3>
              <div className="session-detail-modal__game-result">
                <div className="session-detail-modal__game-stat">
                  <span className="session-detail-modal__game-label">Best Result</span>
                  <span className="session-detail-modal__game-value">
                    {session.bestResult}
                    {session.type === 'closest-to-pin' ? ' ft' : ' yds'}
                  </span>
                  {session.isPersonalBest && (
                    <span className="session-detail-modal__pb-badge">Personal Best!</span>
                  )}
                </div>
                <div className="session-detail-modal__game-stat">
                  <span className="session-detail-modal__game-label">Attempts</span>
                  <span className="session-detail-modal__game-value">{session.attempts}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

