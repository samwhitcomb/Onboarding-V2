import {
  Session,
  RangeSession,
  CourseplaySession,
  CombineSession,
  GameSession,
} from './sessionTypes'

// Helper to create dates relative to now
const daysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

// Helper to generate hole scores that sum to total score
const generateHoleScores = (totalScore: number, par: number = 72): { holeScores: number[], holePars: number[] } => {
  const pars = Array(18).fill(4) // Default to par 4, we'll adjust some
  // Make it more realistic: 4 par 3s, 4 par 5s, 10 par 4s
  pars[0] = 4; pars[1] = 5; pars[2] = 3; pars[3] = 4; pars[4] = 4; pars[5] = 3;
  pars[6] = 5; pars[7] = 4; pars[8] = 4; pars[9] = 4; pars[10] = 3; pars[11] = 5;
  pars[12] = 4; pars[13] = 4; pars[14] = 5; pars[15] = 3; pars[16] = 4; pars[17] = 4;
  
  const scores: number[] = []
  let currentTotal = 0
  
  // Generate scores with some variance
  for (let i = 0; i < 18; i++) {
    const holePar = pars[i]
    // Most holes near par, some birdies, some bogeys
    const variance = Math.random() < 0.6 ? 0 : (Math.random() < 0.5 ? -1 : 1)
    const score = Math.max(1, holePar + variance)
    scores.push(score)
    currentTotal += score
  }
  
  // Adjust to match total score
  const diff = totalScore - currentTotal
  if (diff !== 0) {
    const adjustment = diff > 0 ? 1 : -1
    const holesToAdjust = Math.abs(diff)
    for (let i = 0; i < holesToAdjust && i < 18; i++) {
      const idx = Math.floor(Math.random() * 18)
      const newScore = Math.max(1, scores[idx] + adjustment)
      currentTotal = currentTotal - scores[idx] + newScore
      scores[idx] = newScore
      if (currentTotal === totalScore) break
    }
  }
  
  return { holeScores: scores, holePars: pars }
}

// Course IDs matching our copied images
const COURSE_IDS = [
  { id: 'pebble-beach', name: 'Pebble Beach Golf Links' },
  { id: 'augusta-national', name: 'Augusta National Golf Club' },
  { id: 'st-andrews', name: 'St. Andrews Old Course' },
  { id: 'pinehurst-no2', name: 'Pinehurst No. 2' },
  { id: 'cypress-point', name: 'Cypress Point Club' },
  { id: 'oakmont', name: 'Oakmont Country Club' },
  { id: 'merion-east', name: 'Merion Golf Club (East)' },
  { id: 'shinnecock-hills', name: 'Shinnecock Hills Golf Club' },
  { id: 'bethpage-black', name: 'Bethpage State Park (Black)' },
  { id: 'royal-county-down', name: 'Royal County Down' },
  { id: 'royal-dornoch', name: 'Royal Dornoch Golf Club' },
  { id: 'royal-melbourne', name: 'Royal Melbourne Golf Club' },
  { id: 'royal-portrush', name: 'Royal Portrush Golf Club' },
  { id: 'carnoustie', name: 'Carnoustie Golf Links' },
  { id: 'muirfield', name: 'Muirfield' },
  { id: 'turnberry', name: 'Turnberry (Ailsa)' },
  { id: 'royal-birkdale', name: 'Royal Birkdale Golf Club' },
  { id: 'royal-troon', name: 'Royal Troon Golf Club' },
  { id: 'bandon-dunes', name: 'Bandon Dunes' },
  { id: 'pacific-dunes', name: 'Pacific Dunes' },
  { id: 'kiawah-ocean', name: 'Kiawah Island (Ocean Course)' },
  { id: 'torrey-pines-south', name: 'Torrey Pines (South Course)' },
  { id: 'tpc-sawgrass', name: 'TPC Sawgrass (Stadium Course)' },
  { id: 'harbour-town', name: 'Harbour Town Golf Links' },
  { id: 'spyglass-hill', name: 'Spyglass Hill Golf Course' },
  { id: 'cabot-cliffs', name: 'Cabot Cliffs' },
  { id: 'sand-hills', name: 'Sand Hills Golf Club' },
  { id: 'shadow-creek', name: 'Shadow Creek' },
  { id: 'riviera', name: 'Riviera Country Club' },
]

// Practice Range Sessions
const practiceRangeSessions: RangeSession[] = [
  {
    id: 'pr-001',
    type: 'practice-range',
    date: daysAgo(1),
    duration: 45,
    isSimulator: true,
    shotCount: 67,
    clubsUsed: ['Driver', '7 Iron', 'Sand Wedge', 'Pitching Wedge'],
  },
  {
    id: 'pr-002',
    type: 'practice-range',
    date: daysAgo(3),
    duration: 60,
    isSimulator: true,
    shotCount: 89,
    clubsUsed: ['3 Wood', '5 Iron', '8 Iron', 'Gap Wedge'],
  },
  {
    id: 'pr-003',
    type: 'practice-range',
    date: daysAgo(7),
    duration: 30,
    isSimulator: false,
    shotCount: 45,
    clubsUsed: ['Driver', 'Pitching Wedge'],
  },
]

// Target Range Sessions (with Strokes Gained)
const targetRangeSessions: RangeSession[] = [
  {
    id: 'tr-001',
    type: 'target-range',
    date: daysAgo(2),
    duration: 40,
    isSimulator: true,
    shotCount: 50,
    clubsUsed: ['Driver', '7 Iron', 'Sand Wedge'],
    strokesGained: 2.4,
    sgBreakdown: {
      driver: 1.2,
      irons: 0.8,
      shortGame: 0.4,
    },
  },
  {
    id: 'tr-002',
    type: 'target-range',
    date: daysAgo(5),
    duration: 45,
    isSimulator: true,
    shotCount: 60,
    clubsUsed: ['Driver', '5 Iron', 'Pitching Wedge'],
    strokesGained: 1.8,
    sgBreakdown: {
      driver: 0.9,
      irons: 0.6,
      shortGame: 0.3,
    },
  },
  {
    id: 'tr-003',
    type: 'target-range',
    date: daysAgo(9),
    duration: 50,
    isSimulator: true,
    shotCount: 55,
    clubsUsed: ['3 Wood', '6 Iron', 'Gap Wedge'],
    strokesGained: 3.1,
    sgBreakdown: {
      driver: 1.5,
      irons: 1.2,
      shortGame: 0.4,
    },
  },
  {
    id: 'tr-004',
    type: 'target-range',
    date: daysAgo(12),
    duration: 35,
    isSimulator: true,
    shotCount: 48,
    clubsUsed: ['Driver', '8 Iron', 'Sand Wedge'],
    strokesGained: 1.2,
    sgBreakdown: {
      driver: 0.5,
      irons: 0.4,
      shortGame: 0.3,
    },
  },
  {
    id: 'tr-005',
    type: 'target-range',
    date: daysAgo(18),
    duration: 55,
    isSimulator: true,
    shotCount: 72,
    clubsUsed: ['Driver', '4 Iron', '7 Iron', 'Pitching Wedge'],
    strokesGained: 2.7,
    sgBreakdown: {
      driver: 1.3,
      irons: 1.0,
      shortGame: 0.4,
    },
  },
  {
    id: 'tr-006',
    type: 'target-range',
    date: daysAgo(25),
    duration: 40,
    isSimulator: true,
    shotCount: 50,
    clubsUsed: ['Driver', '6 Iron', 'Gap Wedge'],
    strokesGained: 1.5,
    sgBreakdown: {
      driver: 0.7,
      irons: 0.5,
      shortGame: 0.3,
    },
  },
  {
    id: 'tr-007',
    type: 'target-range',
    date: daysAgo(32),
    duration: 48,
    isSimulator: false,
    shotCount: 58,
    clubsUsed: ['Driver', '5 Iron', 'Sand Wedge'],
    strokesGained: 2.0,
    sgBreakdown: {
      driver: 1.0,
      irons: 0.7,
      shortGame: 0.3,
    },
  },
]

// Courseplay Simulator Sessions
const courseplaySimSessions: CourseplaySession[] = [
  {
    id: 'cs-001',
    type: 'courseplay-sim',
    date: daysAgo(0),
    duration: 180,
    isSimulator: true,
    courseId: 'pebble-beach',
    courseName: 'Pebble Beach Golf Links',
    score: 78,
    par: 72,
    gir: 11,
    putts: 32,
    fairwaysHit: 9,
    ...generateHoleScores(78, 72),
  },
  {
    id: 'cs-002',
    type: 'courseplay-sim',
    date: daysAgo(4),
    duration: 165,
    isSimulator: true,
    courseId: 'augusta-national',
    courseName: 'Augusta National Golf Club',
    score: 82,
    par: 72,
    gir: 9,
    putts: 34,
    fairwaysHit: 7,
    ...generateHoleScores(82, 72),
  },
  {
    id: 'cs-003',
    type: 'courseplay-sim',
    date: daysAgo(8),
    duration: 170,
    isSimulator: true,
    courseId: 'st-andrews',
    courseName: 'St. Andrews Old Course',
    score: 75,
    par: 72,
    gir: 12,
    putts: 30,
    fairwaysHit: 10,
    ...generateHoleScores(75, 72),
  },
  {
    id: 'cs-004',
    type: 'courseplay-sim',
    date: daysAgo(11),
    duration: 175,
    isSimulator: true,
    courseId: 'pinehurst-no2',
    courseName: 'Pinehurst No. 2',
    score: 80,
    par: 72,
    gir: 10,
    putts: 33,
    fairwaysHit: 8,
    ...generateHoleScores(80, 72),
  },
  {
    id: 'cs-005',
    type: 'courseplay-sim',
    date: daysAgo(15),
    duration: 168,
    isSimulator: true,
    courseId: 'cypress-point',
    courseName: 'Cypress Point Club',
    score: 76,
    par: 72,
    gir: 11,
    putts: 31,
    fairwaysHit: 9,
    ...generateHoleScores(76, 72),
  },
  {
    id: 'cs-006',
    type: 'courseplay-sim',
    date: daysAgo(22),
    duration: 172,
    isSimulator: true,
    courseId: 'oakmont',
    courseName: 'Oakmont Country Club',
    score: 84,
    par: 72,
    gir: 8,
    putts: 35,
    fairwaysHit: 6,
    ...generateHoleScores(84, 72),
  },
]

// Courseplay Live Sessions
const courseplayLiveSessions: CourseplaySession[] = [
  {
    id: 'cl-001',
    type: 'courseplay-live',
    date: daysAgo(6),
    duration: 240,
    isSimulator: false,
    courseId: 'torrey-pines-south',
    courseName: 'Torrey Pines (South Course)',
    score: 85,
    par: 72,
    gir: 8,
    putts: 34,
    fairwaysHit: 7,
    weather: {
      condition: 'sunny',
      temp: 72,
    },
    ...generateHoleScores(85, 72),
  },
  {
    id: 'cl-002',
    type: 'courseplay-live',
    date: daysAgo(13),
    duration: 255,
    isSimulator: false,
    courseId: 'tpc-sawgrass',
    courseName: 'TPC Sawgrass (Stadium Course)',
    score: 82,
    par: 72,
    gir: 9,
    putts: 33,
    fairwaysHit: 8,
    weather: {
      condition: 'cloudy',
      temp: 68,
    },
    ...generateHoleScores(82, 72),
  },
  {
    id: 'cl-003',
    type: 'courseplay-live',
    date: daysAgo(20),
    duration: 270,
    isSimulator: false,
    courseId: 'harbour-town',
    courseName: 'Harbour Town Golf Links',
    score: 78,
    par: 71,
    gir: 10,
    putts: 31,
    fairwaysHit: 9,
    weather: {
      condition: 'sunny',
      temp: 75,
    },
    ...generateHoleScores(78, 71),
  },
  {
    id: 'cl-004',
    type: 'courseplay-live',
    date: daysAgo(27),
    duration: 245,
    isSimulator: false,
    courseId: 'spyglass-hill',
    courseName: 'Spyglass Hill Golf Course',
    score: 88,
    par: 72,
    gir: 7,
    putts: 36,
    fairwaysHit: 6,
    weather: {
      condition: 'rain',
      temp: 58,
    },
    ...generateHoleScores(88, 72),
  },
  {
    id: 'cl-005',
    type: 'courseplay-live',
    date: daysAgo(34),
    duration: 235,
    isSimulator: false,
    courseId: 'riviera',
    courseName: 'Riviera Country Club',
    score: 80,
    par: 71,
    gir: 9,
    putts: 32,
    fairwaysHit: 8,
    weather: {
      condition: 'sunny',
      temp: 70,
    },
    ...generateHoleScores(80, 71),
  },
  {
    id: 'cl-006',
    type: 'courseplay-live',
    date: daysAgo(41),
    duration: 260,
    isSimulator: false,
    courseId: 'bandon-dunes',
    courseName: 'Bandon Dunes',
    score: 83,
    par: 72,
    gir: 8,
    putts: 34,
    fairwaysHit: 7,
    weather: {
      condition: 'cloudy',
      temp: 62,
    },
    ...generateHoleScores(83, 72),
  },
]

// Combine Sessions
const combineSessions: CombineSession[] = [
  {
    id: 'comb-001',
    type: 'combine',
    date: daysAgo(10),
    duration: 90,
    isSimulator: true,
    totalScore: 82,
    maxScore: 100,
    accuracy: 85,
    distance: 78,
    consistency: 88,
    shotShape: 80,
    trajectoryControl: 75,
    clubsUsed: ['Driver', '7 Iron', 'Pitching Wedge'],
  },
  {
    id: 'comb-002',
    type: 'combine',
    date: daysAgo(17),
    duration: 85,
    isSimulator: true,
    totalScore: 76,
    maxScore: 100,
    accuracy: 80,
    distance: 72,
    consistency: 82,
    shotShape: 75,
    trajectoryControl: 70,
    clubsUsed: ['Driver', '5 Iron', 'Sand Wedge'],
  },
  {
    id: 'comb-003',
    type: 'combine',
    date: daysAgo(24),
    duration: 95,
    isSimulator: true,
    totalScore: 88,
    maxScore: 100,
    accuracy: 90,
    distance: 85,
    consistency: 92,
    shotShape: 86,
    trajectoryControl: 82,
    clubsUsed: ['Driver', '3 Wood', '7 Iron', 'Pitching Wedge'],
  },
  {
    id: 'comb-004',
    type: 'combine',
    date: daysAgo(31),
    duration: 88,
    isSimulator: true,
    totalScore: 79,
    maxScore: 100,
    accuracy: 82,
    distance: 75,
    consistency: 84,
    shotShape: 78,
    trajectoryControl: 73,
    clubsUsed: ['Driver', '6 Iron', 'Gap Wedge'],
  },
  {
    id: 'comb-005',
    type: 'combine',
    date: daysAgo(38),
    duration: 92,
    isSimulator: true,
    totalScore: 84,
    maxScore: 100,
    accuracy: 86,
    distance: 80,
    consistency: 89,
    shotShape: 82,
    trajectoryControl: 78,
    clubsUsed: ['Driver', '4 Iron', '8 Iron', 'Pitching Wedge'],
  },
  {
    id: 'comb-006',
    type: 'combine',
    date: daysAgo(45),
    duration: 87,
    isSimulator: true,
    totalScore: 74,
    maxScore: 100,
    accuracy: 78,
    distance: 70,
    consistency: 80,
    shotShape: 73,
    trajectoryControl: 68,
    clubsUsed: ['Driver', '7 Iron', 'Sand Wedge'],
  },
  {
    id: 'comb-007',
    type: 'combine',
    date: daysAgo(52),
    duration: 90,
    isSimulator: true,
    totalScore: 81,
    maxScore: 100,
    accuracy: 84,
    distance: 77,
    consistency: 86,
    shotShape: 79,
    trajectoryControl: 74,
    clubsUsed: ['Driver', '5 Iron', 'Pitching Wedge'],
  },
  {
    id: 'comb-008',
    type: 'combine',
    date: daysAgo(59),
    duration: 93,
    isSimulator: false,
    totalScore: 72,
    maxScore: 100,
    accuracy: 75,
    distance: 68,
    consistency: 78,
    shotShape: 70,
    trajectoryControl: 66,
    clubsUsed: ['Driver', '6 Iron', 'Sand Wedge'],
  },
]

// Game Sessions (CTP and Longest Drive)
const gameSessions: GameSession[] = [
  {
    id: 'ctp-001',
    type: 'closest-to-pin',
    date: daysAgo(14),
    duration: 20,
    isSimulator: true,
    bestResult: 2.3, // feet
    isPersonalBest: true,
    attempts: 5,
  },
  {
    id: 'ctp-002',
    type: 'closest-to-pin',
    date: daysAgo(21),
    duration: 18,
    isSimulator: true,
    bestResult: 4.8,
    isPersonalBest: false,
    attempts: 5,
  },
  {
    id: 'ctp-003',
    type: 'closest-to-pin',
    date: daysAgo(35),
    duration: 22,
    isSimulator: true,
    bestResult: 3.5,
    isPersonalBest: false,
    attempts: 5,
  },
  {
    id: 'ctp-004',
    type: 'closest-to-pin',
    date: daysAgo(49),
    duration: 19,
    isSimulator: true,
    bestResult: 5.2,
    isPersonalBest: false,
    attempts: 5,
  },
  {
    id: 'ld-001',
    type: 'longest-drive',
    date: daysAgo(16),
    duration: 15,
    isSimulator: true,
    bestResult: 312, // yards
    isPersonalBest: true,
    attempts: 6,
  },
  {
    id: 'ld-002',
    type: 'longest-drive',
    date: daysAgo(28),
    duration: 17,
    isSimulator: true,
    bestResult: 298,
    isPersonalBest: false,
    attempts: 6,
  },
  {
    id: 'ld-003',
    type: 'longest-drive',
    date: daysAgo(42),
    duration: 16,
    isSimulator: true,
    bestResult: 305,
    isPersonalBest: false,
    attempts: 6,
  },
  {
    id: 'ld-004',
    type: 'longest-drive',
    date: daysAgo(56),
    duration: 18,
    isSimulator: false,
    bestResult: 290,
    isPersonalBest: false,
    attempts: 6,
  },
]

// Combine all sessions
export const allSessions: Session[] = [
  ...practiceRangeSessions,
  ...targetRangeSessions,
  ...courseplaySimSessions,
  ...courseplayLiveSessions,
  ...combineSessions,
  ...gameSessions,
].sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort by date, newest first

// Export individual arrays for testing/filtering
export {
  practiceRangeSessions,
  targetRangeSessions,
  courseplaySimSessions,
  courseplayLiveSessions,
  combineSessions,
  gameSessions,
  COURSE_IDS,
}

// Helper function to limit sessions by type
const limitByType = <T extends Session>(sessions: T[], type: Session['type'], limit: number): T[] => {
  return sessions.filter((s) => s.type === type).slice(0, limit) as T[]
}

// Helper functions for filtering
export const getRecentActivity = (limit: number = 10): Session[] => {
  // Return all sessions sorted by date (newest first) - no limit for "recent"
  return [...allSessions].sort((a, b) => b.date.getTime() - a.date.getTime())
}

export const getCourseplaySessions = (): CourseplaySession[] => {
  // Limit to 2 of each type
  const simSessions = limitByType(allSessions, 'courseplay-sim', 2) as CourseplaySession[]
  const liveSessions = limitByType(allSessions, 'courseplay-live', 2) as CourseplaySession[]
  return [...simSessions, ...liveSessions].sort((a, b) => b.date.getTime() - a.date.getTime())
}

export const getAnalyticsSessions = (): (RangeSession | CombineSession)[] => {
  // Limit to 2 of each type
  const targetRange = limitByType(allSessions, 'target-range', 2) as RangeSession[]
  const combine = limitByType(allSessions, 'combine', 2) as CombineSession[]
  return [...targetRange, ...combine].sort((a, b) => b.date.getTime() - a.date.getTime())
}

export const getGameSessions = (): GameSession[] => {
  // Limit to 2 of each type
  const ctp = limitByType(allSessions, 'closest-to-pin', 2) as GameSession[]
  const longestDrive = limitByType(allSessions, 'longest-drive', 2) as GameSession[]
  return [...ctp, ...longestDrive].sort((a, b) => b.date.getTime() - a.date.getTime())
}

export const filterBySimulator = (sessions: Session[], isSimulator: boolean): Session[] => {
  return sessions.filter((s) => s.isSimulator === isSimulator)
}

