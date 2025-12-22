export type SessionType = 
  | 'practice-range'      // Free practice
  | 'target-range'        // Strokes Gained sessions
  | 'courseplay-sim'      // Virtual rounds
  | 'courseplay-live'     // Real rounds
  | 'combine'             // Full assessment
  | 'closest-to-pin'      // CTP game
  | 'longest-drive'       // Distance game

export interface BaseSession {
  id: string
  type: SessionType
  date: Date
  duration: number // minutes
  isSimulator: boolean
}

export interface RangeSession extends BaseSession {
  type: 'practice-range' | 'target-range'
  shotCount: number
  clubsUsed: string[]
  strokesGained?: number // For target range
  sgBreakdown?: {
    driver: number
    irons: number
    shortGame: number
  }
}

export interface CourseplaySession extends BaseSession {
  type: 'courseplay-sim' | 'courseplay-live'
  courseId: string
  courseName: string
  score: number
  par: number
  gir: number // Greens in regulation
  putts: number
  fairwaysHit?: number
  holeScores?: number[] // Array of 18 hole scores
  holePars?: number[] // Array of 18 hole pars
  weather?: {
    condition: 'sunny' | 'cloudy' | 'rain'
    temp: number
  }
}

export interface CombineSession extends BaseSession {
  type: 'combine'
  totalScore: number
  maxScore: number
  accuracy: number
  distance: number
  consistency: number
  shotShape: number
  trajectoryControl: number
}

export interface GameSession extends BaseSession {
  type: 'closest-to-pin' | 'longest-drive'
  bestResult: number
  isPersonalBest: boolean
  attempts: number
}

export type Session = RangeSession | CourseplaySession | CombineSession | GameSession

// Helper type guards
export function isRangeSession(session: Session): session is RangeSession {
  return session.type === 'practice-range' || session.type === 'target-range'
}

export function isCourseplaySession(session: Session): session is CourseplaySession {
  return session.type === 'courseplay-sim' || session.type === 'courseplay-live'
}

export function isCombineSession(session: Session): session is CombineSession {
  return session.type === 'combine'
}

export function isGameSession(session: Session): session is GameSession {
  return session.type === 'closest-to-pin' || session.type === 'longest-drive'
}

