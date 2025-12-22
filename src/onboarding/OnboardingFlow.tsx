import React, { useState, useEffect } from 'react'
import { useOnboarding } from '../context/OnboardingContext'
import {
  LauncherBackground,
  SessionsBackground,
  ProfileBackground,
  RangeBackground,
  CourseplayBackground,
  PuttingBackground,
  LoadingBackground,
} from '../backgrounds'
import { PlayCardsCarousel } from '../components/PlayCardsCarousel/PlayCardsCarousel'
import { LauncherNav } from '../components/LauncherNav/LauncherNav'
import { SessionsPage } from '../screens/SessionsPage'
import { ProfilePage } from '../screens/ProfilePage'
import { CourseSelectionPage } from '../screens/CourseSelectionPage'
import { SessionDetailModal } from '../components/SessionDetailModal/SessionDetailModal'
import { Session } from '../data/sessionTypes'
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
import { CourseLoadingOverlay } from './CourseLoadingOverlay'
import { CoursePlayLoadingOverlay } from './CoursePlayLoadingOverlay'
import { PracticeLoadingOverlay } from './PracticeLoadingOverlay'
import { RangeLoadingOverlay } from './RangeLoadingOverlay'
import { TargetRangeLoadingOverlay } from './TargetRangeLoadingOverlay'
import { CTPLoadingOverlay } from './CTPLoadingOverlay'
import { CourseplayWarmup } from './CourseplayWarmup'
import { CelebrationModal } from './CelebrationModal'
import { ChallengeIntroModal } from './ChallengeIntroModal'
import { PersonalizedPrepModal } from './PersonalizedPrepModal'
import { ChallengeShotOverlay } from './ChallengeShotOverlay'
import { ShotResultModal } from './ShotResultModal'
import { OnboardingCompleteModal } from './OnboardingCompleteModal'
import { TutorialPractice } from './TutorialPractice'
import { TutorialRange } from './TutorialRange'
import { TutorialTargetRange } from './TutorialTargetRange'
import { TutorialCourses } from './TutorialCourses'
import { TutorialCTP } from './TutorialCTP'
import { FlightPlansWidget } from '../components/FlightPlansWidget/FlightPlansWidget'
import { QuitButton } from '../components/QuitButton/QuitButton'
import { QuitConfirmation } from '../components/QuitConfirmation/QuitConfirmation'
import { ExploreFreelyPrompt } from '../components/ExploreFreelyPrompt/ExploreFreelyPrompt'
import './OnboardingFlow.css'

const OnboardingFlow: React.FC = () => {
  const { currentStep, setCurrentStep } = useOnboarding()
  const [selectedCourseName, setSelectedCourseName] = useState<string>('Pebble Beach Golf Links')
  const [selectedCourseLocation, setSelectedCourseLocation] = useState<string>('Monterey County, CALIFORNIA')
  const [showQuitConfirmation, setShowQuitConfirmation] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [currentPromptId, setCurrentPromptId] = useState<string | null>(null)
  const [launcherSection, setLauncherSection] = useState<'sessions' | 'play' | 'profile'>('play')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [welcomeStep, setWelcomeStep] = useState<'intro' | 'flight-plans'>('intro')
  const [showExploreFreelyPrompt, setShowExploreFreelyPrompt] = useState(false)

  // Listen for course tee off events to get course info
  useEffect(() => {
    const handleCourseTeeOff = (event: Event) => {
      const customEvent = event as CustomEvent
      const { courseName, courseLocation } = customEvent.detail || {}
      if (courseName) setSelectedCourseName(courseName)
      if (courseLocation) setSelectedCourseLocation(courseLocation)
    }

    window.addEventListener('course-tee-off', handleCourseTeeOff)
    return () => {
      window.removeEventListener('course-tee-off', handleCourseTeeOff)
    }
  }, [])

  // Determine if we should show the Flight Plans widget
  // Show on: welcome (step 2 only), flight-plans-intro, and complete (launcher)
  const shouldShowWidget = () => {
    if (currentStep === 'welcome') {
      return welcomeStep === 'flight-plans'
    }
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

  // Get section name based on current step
  const getSectionName = (): string => {
    switch (currentStep) {
      case 'settings-check':
      case 'unit-preference':
      case 'display-confirmation':
      case 'settings-tooltip':
        return 'Setup'
      case 'club-selection-intro':
      case 'club-selection-tooltip':
      case 'club-selection':
        return 'Club Selection'
      case 'five-shot-baseline':
      case 'data-review':
      case 'data-saving':
      case 'baseline-complete':
        return 'Practice'
      case 'tutorial-practice':
        return 'Practice Tutorial'
      case 'tutorial-range':
        return 'Range Tutorial'
      case 'tutorial-target-range':
        return 'Target Range Tutorial'
      case 'tutorial-courses':
        return 'Course Selection Tutorial'
      case 'tutorial-ctp':
        return 'Closest to the Pin Tutorial'
      case 'course-loading':
      case 'course-selection':
        return 'Course Selection'
      case 'course-play-loading':
      case 'courseplay-warmup':
      case 'celebration':
      case 'challenge-intro':
      case 'personalized-prep':
      case 'challenge-shot':
      case 'shot-result':
        return 'Courseplay'
      case 'loading':
        return 'Course Loading'
      default:
        return 'Session'
    }
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

  // Listen for welcome step changes from WelcomeModal
  useEffect(() => {
    const handleWelcomeStepChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ step: 'intro' | 'flight-plans' }>
      setWelcomeStep(customEvent.detail.step)
    }
    window.addEventListener('welcome-step-change', handleWelcomeStepChange)
    return () => {
      window.removeEventListener('welcome-step-change', handleWelcomeStepChange)
    }
  }, [])

  // Show prompt when navigating to play section (unless explicitly dismissed)
  useEffect(() => {
    if (currentStep === 'complete' && launcherSection === 'play') {
      const hasSeenPrompt = localStorage.getItem('exploreFreelyPromptSeen') === 'true'
      
      // Show prompt if user hasn't explicitly dismissed it
      // Reset the prompt visibility when navigating to play section
      if (!hasSeenPrompt) {
        // Add a small delay to ensure smooth transition
        const timer = setTimeout(() => {
          setShowExploreFreelyPrompt(true)
        }, 300)
        return () => clearTimeout(timer)
      } else {
        setShowExploreFreelyPrompt(false)
      }
    } else {
      // Hide prompt if not on play section, but don't reset the seen flag
      setShowExploreFreelyPrompt(false)
    }
  }, [currentStep, launcherSection])


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
      case 'practice-loading':
        return <PracticeLoadingOverlay />
      case 'range-loading':
        return <RangeLoadingOverlay />
      case 'target-range-loading':
        return <TargetRangeLoadingOverlay />
      case 'ctp-loading':
        return <CTPLoadingOverlay />
      case 'course-loading':
        return <CourseLoadingOverlay />
      case 'course-selection':
        return <CourseSelectionPage />
      case 'course-play-loading':
        return <CoursePlayLoadingOverlay courseName={selectedCourseName} courseLocation={selectedCourseLocation} />
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
      case 'tutorial-practice':
        return <TutorialPractice />
      case 'tutorial-range':
        return <TutorialRange />
      case 'tutorial-target-range':
        return <TutorialTargetRange />
      case 'tutorial-courses':
        return <TutorialCourses />
      case 'tutorial-ctp':
        return <TutorialCTP />
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

    // Spotlight for Flight Plans widget during intro or welcome step 2
    const flightPlansMask = (currentStep === 'flight-plans-intro' || (currentStep === 'welcome' && welcomeStep === 'flight-plans')) ? [
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
        return (
          <LauncherBackground 
            maskElements={activeMask}
            onButtonHover={setHoveredButton}
          />
        )
      case 'complete':
        // Show different background based on launcher section
        if (launcherSection === 'sessions') {
          return <SessionsBackground />
        } else if (launcherSection === 'play') {
          return <LauncherBackground />
        } else if (launcherSection === 'profile') {
          return <ProfileBackground />
        } else {
          return <LauncherBackground />
        }
      case 'flight-plans-intro':
        return (
          <LauncherBackground 
            maskElements={activeMask}
            onButtonHover={setHoveredButton}
          />
        )
      case 'tutorial-practice':
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
      case 'practice-loading':
      case 'range-loading':
      case 'target-range-loading':
      case 'ctp-loading':
      case 'course-loading':
      case 'course-play-loading':
        return <LoadingBackground />
      case 'course-selection':
        return <LauncherBackground />
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
      {showQuitButton && <QuitButton onQuit={handleQuitClick} sectionName={getSectionName()} />}
      {showQuitConfirmation && (
        <QuitConfirmation 
          onConfirm={handleQuitConfirm} 
          onCancel={handleQuitCancel}
          sectionName={getSectionName()}
        />
      )}
      {(currentStep === 'complete' || currentStep === 'welcome') && (
        <>
          <LauncherNav 
            activeSection={launcherSection}
            onSectionChange={setLauncherSection}
          />
          {launcherSection === 'play' && <PlayCardsCarousel />}
          {launcherSection === 'sessions' && (
            <SessionsPage onSessionClick={setSelectedSession} />
          )}
          {launcherSection === 'profile' && <ProfilePage />}
        </>
      )}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
      {shouldShowWidget() && (
        <div className={`onboarding-flightplans-widget ${(currentStep === 'flight-plans-intro' || (currentStep === 'welcome' && welcomeStep === 'flight-plans')) ? 'onboarding-flightplans-widget--intro' : ''}`}>
          <FlightPlansWidget />
        </div>
      )}
      {showExploreFreelyPrompt && (
        <ExploreFreelyPrompt 
          onDismiss={() => {
            setShowExploreFreelyPrompt(false)
            // The flag is set in ExploreFreelyPrompt's handleDismiss when user explicitly dismisses
          }} 
        />
      )}
      {renderCurrentStep()}
    </div>
  )
}

export default OnboardingFlow

