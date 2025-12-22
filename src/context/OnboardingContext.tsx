import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type OnboardingStep =
  | 'welcome'
  | 'flight-plans-intro'
  | 'settings-check'
  | 'unit-preference'
  | 'display-confirmation'
  | 'settings-tooltip'
  | 'club-selection-intro'
  | 'club-selection-tooltip'
  | 'club-selection'
  | 'five-shot-baseline'
  | 'data-review'
  | 'data-saving'
  | 'baseline-complete'
  | 'loading'
  | 'courseplay-warmup'
  | 'celebration'
  | 'challenge-intro'
  | 'personalized-prep'
  | 'challenge-shot'
  | 'shot-result'
  | 'onboarding-complete'
  | 'tutorial-practice'
  | 'tutorial-range'
  | 'tutorial-target-range'
  | 'tutorial-courses'
  | 'tutorial-ctp'
  | 'practice-loading'
  | 'range-loading'
  | 'target-range-loading'
  | 'ctp-loading'
  | 'course-loading'
  | 'course-selection'
  | 'course-play-loading'
  | 'complete'

interface OnboardingContextType {
  currentStep: OnboardingStep
  setCurrentStep: (step: OnboardingStep) => void
  completedPhases: string[]
  markPhaseComplete: (phase: string) => void
  lastCompletedStep: OnboardingStep | null
}

const STORAGE_KEY = 'onboardingProgress'

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}

const hydrate = (): { currentStep: OnboardingStep; lastCompletedStep: OnboardingStep | null } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { currentStep: 'welcome', lastCompletedStep: null }
    const parsed = JSON.parse(raw)
    // Don't restore if step is 'complete' - start fresh
    if (parsed.currentStep === 'complete') {
      return { currentStep: 'welcome', lastCompletedStep: parsed.lastCompletedStep || null }
    }
    return {
      currentStep: parsed.currentStep || 'welcome',
      lastCompletedStep: parsed.lastCompletedStep || null,
    }
  } catch {
    return { currentStep: 'welcome', lastCompletedStep: null }
  }
}

const persist = (currentStep: OnboardingStep, lastCompletedStep: OnboardingStep | null) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentStep, lastCompletedStep }),
    )
  } catch {
    /* ignore */
  }
}

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const hydrated = hydrate()
  const [currentStep, setCurrentStepState] = useState<OnboardingStep>(hydrated.currentStep)
  const [lastCompletedStep, setLastCompletedStep] = useState<OnboardingStep | null>(
    hydrated.lastCompletedStep,
  )
  const [completedPhases, setCompletedPhases] = useState<string[]>([])

  const setCurrentStep = (step: OnboardingStep) => {
    setCurrentStepState(step)
    // Update lastCompletedStep when moving forward
    const stepOrder: OnboardingStep[] = [
      'welcome',
      'flight-plans-intro',
      'settings-check',
      'unit-preference',
      'display-confirmation',
      'settings-tooltip',
      'club-selection-intro',
      'club-selection-tooltip',
      'club-selection',
      'five-shot-baseline',
      'data-review',
      'data-saving',
      'baseline-complete',
      'loading',
      'courseplay-warmup',
      'celebration',
      'challenge-intro',
      'personalized-prep',
      'challenge-shot',
      'complete',
    ]
    const currentIndex = stepOrder.indexOf(step)
    const lastIndex = lastCompletedStep ? stepOrder.indexOf(lastCompletedStep) : -1
    if (currentIndex > lastIndex) {
      setLastCompletedStep(step)
    }
  }

  // Persist whenever currentStep or lastCompletedStep changes
  useEffect(() => {
    persist(currentStep, lastCompletedStep)
  }, [currentStep, lastCompletedStep])

  // Clear progress when reaching complete
  useEffect(() => {
    if (currentStep === 'complete') {
      // Keep lastCompletedStep but clear currentStep persistence
      // This allows Flight Plans to know what was completed
    }
  }, [currentStep])

  const markPhaseComplete = (phase: string) => {
    setCompletedPhases((prev) => [...prev, phase])
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        completedPhases,
        markPhaseComplete,
        lastCompletedStep,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

