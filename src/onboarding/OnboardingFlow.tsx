import React, { useState, useEffect } from 'react'
import { useOnboarding } from '../context/OnboardingContext'
import {
  LauncherBackground,
  RangeBackground,
  CourseplayBackground,
  PuttingBackground,
  LoadingBackground,
} from '../backgrounds'
import { FlightPlansCarousel } from '../components/FlightPlansCarousel/FlightPlansCarousel'
import { WelcomeModal } from './WelcomeModal'
import { FlightPlansIntro } from './FlightPlansIntro'
import { SettingsCheckSequence } from './SettingsCheckSequence'
import { ClubSelectionIntro } from './ClubSelectionIntro'
import { ClubSelectionTooltip } from './ClubSelectionTooltip'
import { ClubSelectionModal } from './ClubSelectionModal'
import { FiveShotBaseline } from './FiveShotBaseline'
import { DataReviewModal } from './DataReviewModal'
import { DataSavingModal } from './DataSavingModal'
import { LoadingOverlay } from './LoadingOverlay'
import { CourseplayWarmup } from './CourseplayWarmup'
import { CelebrationModal } from './CelebrationModal'
import { ChallengeIntroModal } from './ChallengeIntroModal'
import { PersonalizedPrepModal } from './PersonalizedPrepModal'
import { ChallengeShotOverlay } from './ChallengeShotOverlay'
import { ShotResultModal } from './ShotResultModal'
import { OnboardingCompleteModal } from './OnboardingCompleteModal'
import { FlightPlansWidget } from '../components/FlightPlansWidget/FlightPlansWidget'
import { QuitButton } from '../components/QuitButton/QuitButton'
import { QuitConfirmation } from '../components/QuitConfirmation/QuitConfirmation'
import './OnboardingFlow.css'

const OnboardingFlow: React.FC = () => {
  const { currentStep, setCurrentStep } = useOnboarding()
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [currentPromptId, setCurrentPromptId] = useState<string | null>(null)

  // Determine if we should show the Flight Plans widget
  // Only show on: flight-plans-intro and complete (launcher)
  const shouldShowWidget = () => {
    return currentStep === 'flight-plans-intro' || currentStep === 'complete'
  }

  const handleQuit = () => {
    // Navigate to complete - the FlightPlansContext will preserve inProgress status
    // since we removed the auto-clear on complete
    setCurrentStep('complete')
  }

  const handleQuitClick = () => {
    setShowQuitConfirmation(true)
  }

  const handleQuitConfirm = () => {
    setShowQuitConfirmation(false)
    handleQuit()
  }

  const handleQuitCancel = () => {
    setShowQuitConfirmation(false)
  }

  // Global keyboard handler for Escape key to quit from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not already showing a modal/confirmation
      // and not on welcome or complete screens
      if (
        e.key === 'Escape' &&
        !showQuitConfirmation &&
        currentStep !== 'welcome' &&
        currentStep !== 'complete'
      ) {
        // Check if we're not in an input field
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          setShowQuitConfirmation(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showQuitConfirmation, currentStep])

  // Listen for prompt index changes from FiveShotBaseline
  useEffect(() => {
    const handlePromptChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ promptIndex: number | null; promptId: string | null }>
      setCurrentPromptId(customEvent.detail.promptId)
    }
    window.addEventListener('prompt-index-change', handlePromptChange)
    return () => {
      window.removeEventListener('prompt-index-change', handlePromptChange)
    }
  }, [])

  const showQuitButton = currentStep !== 'welcome' && currentStep !== 'complete'

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeModal />
      case 'flight-plans-intro':
        return <FlightPlansIntro />
      case 'settings-check':
      case 'unit-preference':
      case 'display-confirmation':
      case 'settings-tooltip':
        return (
          <SettingsCheckSequence 
            hoveredButton={hoveredButton}
            onButtonHover={setHoveredButton}
            onButtonClick={(buttonId) => {
              if (buttonId === 'settings-button' && currentStep === 'settings-tooltip') {
                // Dispatch custom event to open settings modal
                const event = new CustomEvent('settings-button-click', { detail: { buttonId } })
                window.dispatchEvent(event)
              }
            }}
            onSettingsClick={() => {
              // Direct callback - will be handled by SettingsCheckSequence via event
            }}
          />
        )
      case 'club-selection-intro':
        return <ClubSelectionIntro />
      case 'club-selection-tooltip':
        return (
          <ClubSelectionTooltip 
            hoveredButton={hoveredButton}
            onButtonHover={setHoveredButton}
          />
        )
      case 'club-selection':
        return <ClubSelectionModal />
      case 'five-shot-baseline':
        return (
          <FiveShotBaseline 
            hoveredButton={hoveredButton}
            onButtonHover={setHoveredButton}
          />
        )
      case 'data-review':
        return <DataReviewModal />
      case 'data-saving':
        return <DataSavingModal />
      case 'baseline-complete':
        return (
          <FlightPlansWidget
            transitionMode={true}
            justCompletedTaskId="First Flight"
            nextTaskId="Hole in one challenge"
            onContinue={() => setCurrentStep('loading')}
            onExit={() => setCurrentStep('welcome')}
          />
        )
      case 'loading':
        return <LoadingOverlay />
      case 'courseplay-warmup':
        return <CourseplayWarmup />
      case 'celebration':
        return <CelebrationModal />
      case 'challenge-intro':
        return <ChallengeIntroModal />
      case 'personalized-prep':
        return <PersonalizedPrepModal />
      case 'challenge-shot':
        return <ChallengeShotOverlay />
      case 'shot-result':
        return <ShotResultModal />
      case 'onboarding-complete':
        return <OnboardingCompleteModal />
      case 'complete':
        return null
      default:
        return <WelcomeModal />
    }
  }

  const getBackground = () => {
    // Define mask elements for settings tooltip
    // Values are percentages of the original image dimensions (0-100)
    const settingsButtonMask = currentStep === 'settings-tooltip' ? [
      {
        id: 'settings-button',
        top: 3.5,    // Percentage from top of image
        right: 5.2,  // Percentage from right of image
        width: 3,  // Percentage of image width
        height: 5.5, // Percentage of image height
        highlight: true,
        mode: 'spotlight' as const, // Clear inside, dark/blur outside
      }
    ] : []

    // Define mask elements for club selection button
    // Position estimated - adjust based on actual button location in range screen
    const clubSelectionButtonMask = currentStep === 'club-selection-tooltip' ? [
      {
        id: 'club-selection-button',
        top: 66.5,      // Percentage from top of image (estimated - adjust as needed)
        left: 19,     // Percentage from left of image (estimated - adjust as needed)
        width: 6,    // Percentage of image width
        height: 6,   // Percentage of image height
        highlight: true,
        mode: 'spotlight' as const,
      }
    ] : []

    // Define mask elements for prompt sequence (after first shot)
    // Only show mask for the current active prompt
    const promptMasks: Array<{
      id: string
      top: number
      left?: number
      right?: number
      width: number
      height: number
      highlight: boolean
      mode: 'spotlight'
    }> = []
    
    // Only add mask if we're in five-shot-baseline step and have an active prompt
    if (currentStep === 'five-shot-baseline' && currentPromptId) {
      const promptMaskConfigs: Record<string, {
        top: number
        left?: number
        right?: number
        width: number
        height: number
      }> = {
        'club-data': {
          top: 29,    // Percentage from top
          left: 19,   // Percentage from left
          width: 3.5,  // Percentage of width
          height: 6, // Percentage of height
        },
        'dispersion-view': {
          top: 35,    // Percentage from top
          left: 19,   // Percentage from left
          width: 3.5, // Percentage of width
          height: 19, // Percentage of height
        },
        'data-panels': {
          top: 4,    // Percentage from top
          left: 82,    // Percentage from left
          width: 9.5,  // Percentage of width
          height: 5, // Percentage of height
        },
      }

      const config = promptMaskConfigs[currentPromptId]
      if (config) {
        promptMasks.push({
          id: currentPromptId,
          ...config,
          highlight: true,
          mode: 'spotlight' as const,
        })
      }
    }

    // Spotlight for Flight Plans widget during intro
    const flightPlansMask = currentStep === 'flight-plans-intro' ? [
      {
        id: 'flight-plans-widget',
        top: 1,       // Align to minimized widget position
        left: 56,     // 100 - right(14) - width(30) = 56
        width: 30,    // Match minimized width
        height: 12,   // Slightly taller for padding
        highlight: true,
        mode: 'spotlight' as const,
      }
    ] : []

    const activeMask = settingsButtonMask.length > 0 
      ? settingsButtonMask 
      : clubSelectionButtonMask.length > 0 
        ? clubSelectionButtonMask 
        : flightPlansMask.length > 0 
          ? flightPlansMask 
          : promptMasks

    switch (currentStep) {
      case 'welcome':
      case 'complete':
        return <LauncherBackground />
      case 'flight-plans-intro':
        return (
          <LauncherBackground 
            maskElements={activeMask}
            onButtonHover={setHoveredButton}
          />
        )
      case 'settings-check':
      case 'unit-preference':
      case 'display-confirmation':
      case 'settings-tooltip':
      case 'club-selection-intro':
      case 'club-selection-tooltip':
      case 'club-selection':
      case 'five-shot-baseline':
      case 'data-review':
      case 'data-saving':
        const handleButtonClick = (buttonId: string) => {
          if (buttonId === 'settings-button' && currentStep === 'settings-tooltip') {
            // Dispatch custom event to open settings modal
            const event = new CustomEvent('settings-button-click', { 
              detail: { buttonId },
              bubbles: true,
              cancelable: true
            })
            window.dispatchEvent(event)
          } else if (buttonId === 'club-selection-button' && currentStep === 'club-selection-tooltip') {
            // Open club selection modal
            setCurrentStep('club-selection')
          }
        }
        
        return (
          <RangeBackground 
            maskElements={activeMask}
            onButtonHover={setHoveredButton}
            onButtonClick={handleButtonClick}
          />
        )
      case 'loading':
        return <LoadingBackground />
      case 'courseplay-warmup':
      case 'celebration':
      case 'challenge-intro':
      case 'personalized-prep':
      case 'challenge-shot':
        return <CourseplayBackground />
      case 'shot-result':
        return <PuttingBackground />
      case 'onboarding-complete':
        return <LauncherBackground />
      default:
        return <LauncherBackground />
    }
  }

  return (
    <div className="onboarding-flow">
      {getBackground()}
      {showQuitButton && <QuitButton onQuit={handleQuitClick} />}
      {showQuitConfirmation && (
        <QuitConfirmation onConfirm={handleQuitConfirm} onCancel={handleQuitCancel} />
      )}
      {currentStep === 'complete' && <FlightPlansCarousel />}
      {shouldShowWidget() && (
        <div className={`onboarding-flightplans-widget ${currentStep === 'flight-plans-intro' ? 'onboarding-flightplans-widget--intro' : ''}`}>
          <FlightPlansWidget />
        </div>
      )}
      {renderCurrentStep()}
    </div>
  )
}

export default OnboardingFlow

