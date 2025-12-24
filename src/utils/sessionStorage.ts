const DELETED_SESSIONS_KEY = 'deletedSessions'

/**
 * Get list of deleted session IDs from localStorage
 */
export function getDeletedSessions(): string[] {
  try {
    const stored = localStorage.getItem(DELETED_SESSIONS_KEY)
    if (!stored) return []
    return JSON.parse(stored) as string[]
  } catch {
    return []
  }
}

/**
 * Mark a session as deleted
 */
export function deleteSession(sessionId: string): void {
  try {
    const deleted = getDeletedSessions()
    if (!deleted.includes(sessionId)) {
      deleted.push(sessionId)
      localStorage.setItem(DELETED_SESSIONS_KEY, JSON.stringify(deleted))
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Check if a session is deleted
 */
export function isSessionDeleted(sessionId: string): boolean {
  return getDeletedSessions().includes(sessionId)
}

/**
 * Filter out deleted sessions from an array
 */
export function filterDeletedSessions<T extends { id: string }>(sessions: T[]): T[] {
  const deleted = getDeletedSessions()
  return sessions.filter((session) => !deleted.includes(session.id))
}

/**
 * Clear all deleted sessions (for testing/reset)
 */
export function clearDeletedSessions(): void {
  try {
    localStorage.removeItem(DELETED_SESSIONS_KEY)
  } catch {
    // Ignore storage errors
  }
}

