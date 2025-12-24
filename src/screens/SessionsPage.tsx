import React, { useState, useCallback } from 'react'
import { GlobalFilter, FilterType } from '../components/GlobalFilter/GlobalFilter'
import { CalendarFilter } from '../components/CalendarFilter/CalendarFilter'
import { SessionRow } from '../components/SessionRow/SessionRow'
import { Session } from '../data/sessionTypes'
import {
  allSessions,
  getRecentActivity,
  getCourseplaySessions,
  getAnalyticsSessions,
  getGameSessions,
  filterBySimulator,
} from '../data/mockSessions'
import { deleteSession, filterDeletedSessions } from '../utils/sessionStorage'
import './SessionsPage.css'

interface SessionsPageProps {
  onSessionClick?: (session: Session) => void
}

export const SessionsPage: React.FC<SessionsPageProps> = ({ onSessionClick }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  const [refreshKey, setRefreshKey] = useState(0) // Force re-render when sessions are deleted

  // Check if user has real sessions (for now, always show example data)
  // In a real app, this would check localStorage/API for user sessions
  const hasUserData = false // TODO: Implement real check

  const handleDeleteSession = useCallback((sessionId: string) => {
    deleteSession(sessionId)
    setRefreshKey((prev) => prev + 1) // Trigger re-render
  }, [])

  // Apply global filter
  const applyFilter = (sessions: Session[]): Session[] => {
    let filtered = sessions

    // Apply type filter
    if (activeFilter === 'simulator') {
      filtered = filterBySimulator(filtered, true)
    } else if (activeFilter === 'live') {
      filtered = filterBySimulator(filtered, false)
    }

    // Apply date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((session) => {
        const sessionDate = new Date(session.date)
        sessionDate.setHours(0, 0, 0, 0)

        if (dateRange.start && dateRange.end) {
          return sessionDate >= dateRange.start && sessionDate <= dateRange.end
        } else if (dateRange.start) {
          return sessionDate >= dateRange.start
        } else if (dateRange.end) {
          return sessionDate <= dateRange.end
        }
        return true
      })
    }

    return filtered
  }

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end })
  }

  // Row 1: Recent Activity (all sessions sorted by completion date)
  const recentSessions = filterDeletedSessions(applyFilter(getRecentActivity()))

  // Row 2: Scorecard Gallery (courseplay sessions)
  const courseplaySessions = filterDeletedSessions(applyFilter(getCourseplaySessions()))

  // Row 3: High-Performance Analytics (target range + combines)
  const analyticsSessions = filterDeletedSessions(applyFilter(getAnalyticsSessions()))

  // Row 4: Games & Challenges
  const gameSessions = filterDeletedSessions(applyFilter(getGameSessions()))

  return (
    <div className="sessions-page">
      {!hasUserData && (
        <div className="sessions-page__banner">
          <div className="sessions-page__banner-content">
            <p className="sessions-page__banner-text">
              Start playing to populate with your own rounds and sessions!
            </p>
          </div>
        </div>
      )}
      <div className="sessions-page__filters">
        <GlobalFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <CalendarFilter onDateRangeChange={handleDateRangeChange} />
      </div>

      <div className="sessions-page__content">
        <SessionRow
          title="Recent Activity"
          description="All sessions sorted by completion date"
          sessions={recentSessions}
          onSessionClick={onSessionClick}
          onDeleteSession={handleDeleteSession}
          showArrows={true}
        />

        <SessionRow
          title="Scorecard Gallery"
          description="Virtual rounds and real-world play"
          sessions={courseplaySessions}
          onSessionClick={onSessionClick}
          onDeleteSession={handleDeleteSession}
          showArrows={true}
        />

        <SessionRow
          title="Practice Sessions"
          description="Target practice and combine assessments"
          sessions={analyticsSessions}
          onSessionClick={onSessionClick}
          onDeleteSession={handleDeleteSession}
          showArrows={true}
        />

        <SessionRow
          title="Games & Challenges"
          description="Closest to Pin, Longest Drive, and more"
          sessions={gameSessions}
          onSessionClick={onSessionClick}
          onDeleteSession={handleDeleteSession}
          showArrows={true}
        />
      </div>
    </div>
  )
}

