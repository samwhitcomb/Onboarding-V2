import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useOnboarding, OnboardingStep } from './OnboardingContext'

export type FlightPlanStatus = 'locked' | 'available' | 'completed'

export interface FlightPlanTask {
  id: string
  title: string
  category: 'data-foundation' | 'game-improvement' | 'fun-competition' | 'Setup and Calibration'
  description: string
  feature: string
  unlockOrder: number // lower means shown first
  status: FlightPlanStatus
  actionRoute?: string
  onboardingStep?: OnboardingStep
  inProgress?: boolean
}

interface FlightPlansContextValue {
  tasks: FlightPlanTask[]
  visibleTasks: FlightPlanTask[]
  progress: { completed: number; total: number; percent: number }
  markTaskComplete: (id: string) => void
  markTaskInProgress: (id: string) => void
  clearTaskInProgress: (id: string) => void
  resetProgress: () => void
}

const STORAGE_KEY = 'flightPlansProgress'
const IN_PROGRESS_KEY = 'flightPlansInProgress'

const FlightPlansContext = createContext<FlightPlansContextValue | undefined>(undefined)

const baseTasks: Omit<FlightPlanTask, 'status'>[] = [
  // Data Foundation (initial visible 3)
  {
    id: 'Setup CLM',
    title: 'Setup and Calibrate CLM',
    category: 'Setup and Calibration',
    description: 'Successfully setup and calibrated the CLM unit',
    feature: 'Setup',
    unlockOrder: 1,
    actionRoute: '/launcher', // Assumed to be completed upon login
  },
  {
    id: 'First Flight',
    title: 'Guided First Flight: Baseline Data',
    category: 'data-foundation',
    description: 'Complete the 5-shot Club benchmark',
    feature: 'Distance Control & UI Customization',
    unlockOrder: 2,
    actionRoute: '/data-practice/club-selection', // Route to the general data practice screen for club selection
    onboardingStep: 'unit-preference',
  },
  {
    id: 'Hole in one challenge',
    title: 'Morning at Pebble Beach (The Hero Shot)',
    category: 'data-foundation',
    description: 'Play the 6 - 7 hole sequence for the membership prize',
    feature: 'Courseplay',
    unlockOrder: 3,
    actionRoute: '/courseplay/pebble-beach-7th-challenge', // Route to trigger the specific Act 2 sequence
    onboardingStep: 'courseplay-warmup',
  },

  // --- Post-Onboarding Mastery Flights (Progressively Revealed) ---

  // Category 1: 🛠️ Data Foundation & Setup

  {
    id: 'complete-bag-mapping',
    title: 'Complete a Bag Mapping',
    category: 'data-foundation',
    description: 'Learn about Wedge Matrix and Club Gapping in the practice range.',
    feature: 'Wedge Matrix & Club Gapping',
    unlockOrder: 5,
    actionRoute: '/data-practice/full-bag-mapping',
  },

  // Category 2: 📈 Game Improvement & Analysis
  {
    id: 'dial-in-strokes-gained',
    title: 'Dial in Strokes Gained',
    category: 'game-improvement',
    description: 'Choose your target on the range and get a Strokes Gained score.',
    feature: 'Strokes Gained Analysis',
    unlockOrder: 6,
    actionRoute: '/target-range/strokes-gained-selector',
  },
  {
    id: 'golf-health-check',
    title: 'Take the Golf Health Check',
    category: 'game-improvement',
    description: 'Complete a full Combines session to assess your overall performance.',
    feature: 'Combines Mode',
    unlockOrder: 7,
    actionRoute: '/combines',
  },

  // Category 3: 🎮 Fun & Competition
  {
    id: 'get-competitive',
    title: 'Get Competitive',
    category: 'fun-competition',
    description: 'Challenge a friend in a Closest-to-Pin or Longest Drive competition.',
    feature: 'Challenge Modes (Local Multiplayer)',
    unlockOrder: 8,
    actionRoute: '/challenges/local-multiplayer',
  },

  // Category 4: 🏆 Mastery (The Final Unlock)
  {
    id: 'view-advanced-stats',
    title: 'View Your Advanced Stats',
    category: 'game-improvement',
    description: 'See a club-by-club breakdown of your aggregated shots and historical data.',
    feature: 'Historical Data & Deep Analytics',
    unlockOrder: 10,
    actionRoute: '/history/advanced-stats',
    // This task should only unlock/become visible after tasks 4, 5, 6, 7, 8, and 9 are complete.
  },
]

const hydrate = (): Record<string, FlightPlanStatus> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

const hydrateInProgress = (): Set<string> => {
  try {
    const raw = localStorage.getItem(IN_PROGRESS_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

const persist = (map: Record<string, FlightPlanStatus>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* ignore */
  }
}

const persistInProgress = (inProgressSet: Set<string>) => {
  try {
    localStorage.setItem(IN_PROGRESS_KEY, JSON.stringify(Array.from(inProgressSet)))
  } catch {
    /* ignore */
  }
}

// Map onboarding steps to task IDs
const getTaskIdForStep = (step: OnboardingStep): string | null => {
  // Steps that are part of "Guided First Flight"
  if (
    ['club-selection', 'five-shot-baseline', 'data-review', 'data-saving', 'loading'].includes(
      step,
    )
  ) {
    return 'First Flight'
  }
  // Steps that are part of "Morning at Pebble Beach"
  if (
    ['courseplay-warmup', 'celebration', 'challenge-intro', 'personalized-prep', 'challenge-shot'].includes(
      step,
    )
  ) {
    return 'Hole in one challenge'
  }
  return null
}

export const FlightPlansProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentStep } = useOnboarding()
  
  // Clear progress on initial load if starting from welcome (page refresh)
  // Only "Setup CLM" should be completed at the start
  const [statusMap, setStatusMap] = useState<Record<string, FlightPlanStatus>>(() => {
    // Check onboarding state to see if we should reset
    const onboardingStateRaw = localStorage.getItem('onboardingProgress')
    if (!onboardingStateRaw) {
      // Fresh start - mark Setup CLM as completed, clear everything else
      const initialStatus = { 'Setup CLM': 'completed' as FlightPlanStatus }
      persist(initialStatus)
      return initialStatus
    }
    
    let parsedOnboarding: { currentStep?: string } | null = null
    try {
      parsedOnboarding = JSON.parse(onboardingStateRaw)
      // If onboarding is at welcome or complete, reset flight plans but keep Setup CLM completed
      if (parsedOnboarding?.currentStep === 'welcome' || parsedOnboarding?.currentStep === 'complete') {
        const initialStatus = { 'Setup CLM': 'completed' as FlightPlanStatus }
        persist(initialStatus)
        return initialStatus
      }
    } catch {
      // If we can't parse onboarding state, assume fresh start
      const initialStatus = { 'Setup CLM': 'completed' as FlightPlanStatus }
      persist(initialStatus)
      return initialStatus
    }
    
    // Otherwise, restore persisted state
    // But filter out any completed tasks except Setup CLM if we're at an early onboarding step
    const hydrated = hydrate()
    let shouldFilter = false
    
    if (parsedOnboarding) {
      // If we're at an early step (before club-selection), we shouldn't have other tasks completed
      const earlySteps = ['welcome', 'flight-plans-intro', 'settings-check', 'unit-preference', 'display-confirmation', 'settings-tooltip']
      if (parsedOnboarding.currentStep && earlySteps.includes(parsedOnboarding.currentStep)) {
        shouldFilter = true
      }
    }
    
    if (shouldFilter) {
      // Only keep Setup CLM as completed
      const cleaned = { 'Setup CLM': 'completed' as FlightPlanStatus }
      persist(cleaned)
      return cleaned
    }
    
    // Ensure Setup CLM is always completed
    if (!hydrated['Setup CLM']) {
      hydrated['Setup CLM'] = 'completed'
      persist(hydrated)
    }
    return hydrated
  })
  
  const [inProgressSet, setInProgressSet] = useState<Set<string>>(() => {
    // Check onboarding state to see if we should reset
    const onboardingState = localStorage.getItem('onboardingProgress')
    if (!onboardingState) {
      persistInProgress(new Set())
      return new Set()
    }
    try {
      const parsed = JSON.parse(onboardingState)
      if (parsed.currentStep === 'welcome' || parsed.currentStep === 'complete') {
        persistInProgress(new Set())
        return new Set()
      }
    } catch {
      persistInProgress(new Set())
      return new Set()
    }
    // Otherwise, restore persisted state
    return hydrateInProgress()
  })

  const tasks: FlightPlanTask[] = useMemo(
    () =>
      baseTasks.map((t) => ({
        ...t,
        status: statusMap[t.id] || 'locked',
        inProgress: inProgressSet.has(t.id),
      })),
    [statusMap, inProgressSet],
  )

  // Unlock logic: initial 3 are available, others locked until first 3 are completed.
  const visibleTasks = useMemo(() => {
    const initialVisibleIds = new Set(
      tasks
        .filter((t) => t.unlockOrder <= 3)
        .map((t) => t.id),
    )

    const areFirstThreeDone = [...initialVisibleIds].every((id) => statusMap[id] === 'completed')

    return tasks.map((t): FlightPlanTask => {
      if (initialVisibleIds.has(t.id)) {
        return { ...t, status: t.status === 'locked' ? ('available' as FlightPlanStatus) : t.status }
      }
      // For later tasks, unlock once first three are done
      if (areFirstThreeDone) {
        return { ...t, status: t.status === 'locked' ? ('available' as FlightPlanStatus) : t.status }
      }
      return { ...t, status: 'locked' as FlightPlanStatus }
    })
  }, [tasks, statusMap])

  const progress = useMemo(() => {
    const completed = visibleTasks.filter((t) => t.status === 'completed').length
    const total = visibleTasks.length
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { completed, total, percent }
  }, [visibleTasks])

  const markTaskComplete = (id: string) => {
    setStatusMap((prev) => {
      if (prev[id] === 'completed') return prev
      const next: Record<string, FlightPlanStatus> = { ...prev, [id]: 'completed' as FlightPlanStatus }
      persist(next)
      return next
    })
    // Clear inProgress when task is completed
    clearTaskInProgress(id)
  }

  const markTaskInProgress = (id: string) => {
    setInProgressSet((prev) => {
      const next = new Set(prev)
      next.add(id)
      persistInProgress(next)
      return next
    })
  }

  const clearTaskInProgress = (id: string) => {
    setInProgressSet((prev) => {
      const next = new Set(prev)
      next.delete(id)
      persistInProgress(next)
      return next
    })
  }

  const resetProgress = () => {
    setStatusMap({})
    persist({})
    setInProgressSet(new Set())
    persistInProgress(new Set())
  }

  // Clear flight plans progress when at welcome step (page refresh resets to welcome)
  // Also clear when at 'complete' if user hasn't actually completed First Flight (Explore Freely from welcome)
  // But keep "Setup CLM" as completed
  useEffect(() => {
    if (currentStep === 'welcome') {
      // Clear all tasks except Setup CLM
      const initialStatus = { 'Setup CLM': 'completed' as FlightPlanStatus }
      setStatusMap((prev) => {
        // Only update if we have other tasks completed
        const hasOtherCompleted = Object.keys(prev).some(
          (key) => key !== 'Setup CLM' && prev[key] === 'completed',
        )
        if (hasOtherCompleted || !prev['Setup CLM']) {
          persist(initialStatus)
          return initialStatus
        }
        return prev
      })
      setInProgressSet(new Set())
      persistInProgress(new Set())
    } else if (currentStep === 'complete') {
      // If at 'complete' but First Flight isn't completed, this is Explore Freely from welcome
      // Reset to only Setup CLM completed
      setStatusMap((prev) => {
        const firstFlightCompleted = prev['First Flight'] === 'completed'
        const hasOtherCompleted = Object.keys(prev).some(
          (key) => key !== 'Setup CLM' && prev[key] === 'completed',
        )
        // If First Flight isn't completed but we have other tasks completed, reset
        if (!firstFlightCompleted && hasOtherCompleted) {
          const initialStatus = { 'Setup CLM': 'completed' as FlightPlanStatus }
          persist(initialStatus)
          return initialStatus
        }
        return prev
      })
    }
  }, [currentStep])

  // Auto-mark task as inProgress when user is on a step that maps to a task
  useEffect(() => {
    const taskId = getTaskIdForStep(currentStep)
    if (taskId) {
      // Only mark as inProgress if not already completed
      if (statusMap[taskId] !== 'completed') {
        setInProgressSet((prev) => {
          if (prev.has(taskId)) return prev
          const next = new Set(prev)
          next.add(taskId)
          persistInProgress(next)
          return next
        })
      }
    }
  }, [currentStep, statusMap])

  // Don't clear inProgress when reaching complete - user might have quit
  // inProgress will be cleared when tasks are actually completed

  // Seed completion based on onboarding milestones:
  // - After data-review (5-shot baseline done) => mark "Guided First Flight" as completed
  // - After challenge-shot/complete/celebration (Pebble Beach done) => mark "Morning at Pebble Beach" as completed
  // Don't auto-complete if we're at welcome (fresh start)
  // Don't auto-complete "Hole in one challenge" at 'complete' if First Flight isn't completed (Explore Freely scenario)
  useEffect(() => {
    if (currentStep === 'welcome') return // Fresh start, don't auto-complete
    
    if (currentStep === 'data-review' || currentStep === 'data-saving' || currentStep === 'loading') {
      markTaskComplete('First Flight')
    }
    // Only mark "Hole in one challenge" as complete if First Flight is already completed
    // This prevents marking it complete when clicking "Explore Freely" from welcome
    if (currentStep === 'challenge-shot' || currentStep === 'celebration') {
      markTaskComplete('Hole in one challenge')
    } else if (currentStep === 'complete') {
      // Only mark complete if First Flight is done (user actually went through onboarding)
      if (statusMap['First Flight'] === 'completed') {
        markTaskComplete('Hole in one challenge')
      }
    }
  }, [currentStep, markTaskComplete, statusMap])

  const value: FlightPlansContextValue = {
    tasks,
    visibleTasks,
    progress,
    markTaskComplete,
    markTaskInProgress,
    clearTaskInProgress,
    resetProgress,
  }

  return <FlightPlansContext.Provider value={value}>{children}</FlightPlansContext.Provider>
}

export const useFlightPlans = (): FlightPlansContextValue => {
  const ctx = useContext(FlightPlansContext)
  if (!ctx) throw new Error('useFlightPlans must be used within FlightPlansProvider')
  return ctx
}

