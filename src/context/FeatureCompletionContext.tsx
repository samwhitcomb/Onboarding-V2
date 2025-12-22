import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useFlightPlans } from './FlightPlansContext'

// Feature IDs that map to flight plan tasks
export type FeatureId =
  | 'practice-range'
  | 'courseplay'
  | 'target-range'
  | 'combine'
  | 'closest-to-pin'
  | 'longest-drive'
  | 'bag-mapping'
  | 'advanced-stats'

// Mapping from feature IDs to flight plan task IDs
const FEATURE_TO_TASK_MAP: Record<FeatureId, string> = {
  'practice-range': 'First Flight',
  'courseplay': 'Hole in one challenge',
  'target-range': 'dial-in-strokes-gained',
  'combine': 'golf-health-check',
  'closest-to-pin': 'get-competitive',
  'longest-drive': 'get-competitive',
  'bag-mapping': 'complete-bag-mapping',
  'advanced-stats': 'view-advanced-stats',
}

interface FeatureCompletionContextType {
  markFeatureComplete: (featureId: FeatureId) => void
}

const FeatureCompletionContext = createContext<FeatureCompletionContextType | undefined>(undefined)

export const useFeatureCompletion = () => {
  const context = useContext(FeatureCompletionContext)
  if (!context) {
    throw new Error('useFeatureCompletion must be used within FeatureCompletionProvider')
  }
  return context
}

export const FeatureCompletionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { markTaskComplete } = useFlightPlans()

  useEffect(() => {
    const handleFeatureComplete = (event: Event) => {
      const customEvent = event as CustomEvent<{ featureId: FeatureId }>
      const { featureId } = customEvent.detail

      // Map feature ID to task ID and mark task as complete
      const taskId = FEATURE_TO_TASK_MAP[featureId]
      if (taskId) {
        markTaskComplete(taskId)
      }
    }

    window.addEventListener('feature-complete', handleFeatureComplete)
    return () => {
      window.removeEventListener('feature-complete', handleFeatureComplete)
    }
  }, [markTaskComplete])

  const markFeatureComplete = (featureId: FeatureId) => {
    // Dispatch event that will be caught by the listener above
    window.dispatchEvent(
      new CustomEvent('feature-complete', {
        detail: { featureId },
      }),
    )
  }

  return (
    <FeatureCompletionContext.Provider value={{ markFeatureComplete }}>
      {children}
    </FeatureCompletionContext.Provider>
  )
}


