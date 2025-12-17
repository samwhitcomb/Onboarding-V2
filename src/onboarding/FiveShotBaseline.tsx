import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Popup, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import { useShotData } from '../context/ShotDataContext'
import { useClubBag } from '../context/ClubBagContext'
import { generateMockShot } from '../data'
import impactCamImage from '../assets/images/Impact Cam Replay.png'
import { FlightPathAnimation } from './FlightPathAnimation'
import { BallPlacement } from './BallPlacement'
import './FiveShotBaseline.css'

interface FiveShotBaselineProps {
  hoveredButton?: string | null
  onButtonHover?: (buttonId: string | null) => void
}

export const FiveShotBaseline: React.FC<FiveShotBaselineProps> = ({
  hoveredButton,
  onButtonHover,
}) => {
  const { setCurrentStep } = useOnboarding()
  const { shots, addShot, clearShots } = useShotData()
  const { selectedClub } = useClubBag()
  const [currentShot, setCurrentShot] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState<string>('')
  const [showFlightPath, setShowFlightPath] = useState(false)
  const [showImpactCam, setShowImpactCam] = useState(false)
  const [promptIndex, setPromptIndex] = useState<number | null>(null) // null = not started, number = current prompt index
  const [showCompleteFiveShots, setShowCompleteFiveShots] = useState(false)
  const [showNarrative, setShowNarrative] = useState(true) // Show narrative modal on initial load
  const [buttonPositions, setButtonPositions] = useState<Record<string, { top: number; right: number; width: number; height: number }>>({})
  const [ballPlaced, setBallPlaced] = useState(false)
  const [ballKey, setBallKey] = useState(0)
  const currentShotRef = useRef(0)

  // Initialize – run once
  useEffect(() => {
    clearShots()
    setCurrentShot(0)
    currentShotRef.current = 0
    setShowNarrative(true) // Show narrative when component first loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Dispatch current prompt index to OnboardingFlow for mask display
  useEffect(() => {
    if (promptIndex !== null) {
      const promptIds = ['club-data', 'dispersion-view', 'data-panels']
      const currentPromptId = promptIds[promptIndex]
      const event = new CustomEvent('prompt-index-change', {
        detail: { promptIndex, promptId: currentPromptId },
        bubbles: true,
      })
      window.dispatchEvent(event)
    } else {
      // Clear prompt when done
      const event = new CustomEvent('prompt-index-change', {
        detail: { promptIndex: null, promptId: null },
        bubbles: true,
      })
      window.dispatchEvent(event)
    }
  }, [promptIndex])

  // Calculate button positions for prompt tooltips
  useEffect(() => {
    if (promptIndex === null) return

    const calculateButtonPositions = () => {
      const flowContainer = document.querySelector('.onboarding-flow')
      if (!flowContainer) return

      const containerRect = flowContainer.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerHeight = containerRect.height

      // Define UI element positions (percentages) - must match OnboardingFlow mask positions
      // Club Data
      const clubDataTop = 29
      const clubDataLeft = 19
      const clubDataWidth = 3.5
      const clubDataHeight = 6

      // Dispersion View
      const dispersionTop = 35
      const dispersionLeft = 19
      const dispersionWidth = 3.5
      const dispersionHeight = 19

      // Data Panels
      const dataPanelsTop = 4
      const dataPanelsLeft = 82
      const dataPanelsWidth = 9.5
      const dataPanelsHeight = 5

      const positions: Record<string, { top: number; right: number; width: number; height: number }> = {}

      // Club Data position
      const clubDataTopPx = (clubDataTop / 100) * containerHeight
      const clubDataLeftPx = (clubDataLeft / 100) * containerWidth
      const clubDataWidthPx = (clubDataWidth / 100) * containerWidth
      const clubDataHeightPx = (clubDataHeight / 100) * containerHeight
      positions['club-data'] = {
        top: containerRect.top + clubDataTopPx,
        right: window.innerWidth - (containerRect.left + clubDataLeftPx + clubDataWidthPx),
        width: clubDataWidthPx,
        height: clubDataHeightPx,
      }

      // Dispersion View position
      const dispersionTopPx = (dispersionTop / 100) * containerHeight
      const dispersionLeftPx = (dispersionLeft / 100) * containerWidth
      const dispersionWidthPx = (dispersionWidth / 100) * containerWidth
      const dispersionHeightPx = (dispersionHeight / 100) * containerHeight
      positions['dispersion-view'] = {
        top: containerRect.top + dispersionTopPx,
        right: window.innerWidth - (containerRect.left + dispersionLeftPx + dispersionWidthPx),
        width: dispersionWidthPx,
        height: dispersionHeightPx,
      }

      // Data Panels position
      const dataPanelsTopPx = (dataPanelsTop / 100) * containerHeight
      const dataPanelsLeftPx = (dataPanelsLeft / 100) * containerWidth
      const dataPanelsWidthPx = (dataPanelsWidth / 100) * containerWidth
      const dataPanelsHeightPx = (dataPanelsHeight / 100) * containerHeight
      positions['data-panels'] = {
        top: containerRect.top + dataPanelsTopPx,
        right: window.innerWidth - (containerRect.left + dataPanelsLeftPx + dataPanelsWidthPx),
        width: dataPanelsWidthPx,
        height: dataPanelsHeightPx,
      }

      setButtonPositions(positions)
    }

    calculateButtonPositions()
    window.addEventListener('resize', calculateButtonPositions)

    return () => {
      window.removeEventListener('resize', calculateButtonPositions)
    }
  }, [promptIndex])

  const recordShot = useCallback((shotNumber: number) => {
    const clubType = selectedClub?.type || 'iron'
    const newShot = generateMockShot(shotNumber, clubType)
    addShot(newShot)
    setCurrentShot(shotNumber)
    currentShotRef.current = shotNumber
    
    // Show flight path animation for all shots
    setShowFlightPath(true)
  }, [selectedClub, addShot])

  const handleNextShot = () => {
    setShowPopup(false)
    
    if (currentShot >= 5) {
      setTimeout(() => {
        setCurrentStep('data-review')
      }, 500)
    } else {
      // Record next shot after a brief pause
      setTimeout(() => {
        recordShot(currentShot + 1)
      }, 500)
    }
  }

  const handleFlightPathComplete = () => {
    setShowFlightPath(false)
    
    // Reset ball placement for next shot
    setBallPlaced(false)
    setBallKey(prev => prev + 1)
    
    if (currentShot === 1) {
      // For first shot: show impact cam, then start prompt sequence
      setShowImpactCam(true)
      setTimeout(() => {
        setShowImpactCam(false)
        // Start the prompt sequence after first shot
        setPromptIndex(0)
        setShowPopup(true)
      }, 2000)
    } else {
      // For other shots: just show popup (only after prompt sequence is complete)
      setShowPopup(true)
      setPopupContent(`shot-${currentShot}`)
    }
  }

  const handleRecordShot = () => {
    // Don't allow recording if showing "complete 5 shots" message or showing animations
    // Note: prompts (club replay, dispersion, data panels) don't block recording
    // Prompts remain visible until user explicitly dismisses them
    // Also require ball to be placed
    if (showCompleteFiveShots || showFlightPath || showImpactCam || !ballPlaced) return
    
    // Hide narrative when first shot is taken
    if (showNarrative && currentShot === 0) {
      setShowNarrative(false)
    }
    
    if (currentShot === 0) {
      // Record first shot
      recordShot(1)
    } else if (currentShot < 5) {
      // Record next shot
      recordShot(currentShot + 1)
    }
  }

  // Get club-specific narrative
  const getClubNarrative = () => {
    if (!selectedClub) {
      return "Take your first shot to begin building your baseline."
    }

    const clubName = selectedClub.name || `${selectedClub.brand} ${selectedClub.model}`.trim()
    return `Take your first shot to begin.`
  }

  // Handle prompt sequence navigation
  const handleNextPrompt = () => {
    if (promptIndex === null) return
    
    const prompts = [
      'impact-data',
      'dispersion-view',
      'data-panels',
    ]
    
    if (promptIndex < prompts.length - 1) {
      // Move to next prompt
      setPromptIndex(promptIndex + 1)
    } else {
      // All prompts complete, show "complete 5 shots" message
      setPromptIndex(null)
      setShowCompleteFiveShots(true)
      setShowPopup(true)
    }
  }

  // Auto-dismiss popups for shots 2-5 after a delay
  useEffect(() => {
    // Only auto-dismiss if we're showing shot popups (not prompts)
    if (!showPopup || popupContent === '' || promptIndex !== null || showCompleteFiveShots) return

    const popupDuration = popupContent === 'shot-4' ? 3000 : popupContent === 'shot-5' ? 4000 : 3500
    
    // Extract shot number from popupContent (e.g., "shot-2" -> 2)
    const shotNumMatch = popupContent.match(/shot-(\d+)/)
    const shotNum = shotNumMatch ? parseInt(shotNumMatch[1], 10) : currentShotRef.current
    
    const timer = setTimeout(() => {
      setShowPopup(false)
      
      // If this was the last shot, move to data review
      if (shotNum >= 5) {
        setTimeout(() => {
          setCurrentStep('data-review')
        }, 500)
      }
      // Otherwise, just dismiss the popup - user will click "Record Shot" again
    }, popupDuration)

    return () => clearTimeout(timer)
  }, [showPopup, popupContent, promptIndex, showCompleteFiveShots, setCurrentStep])

  const renderPopup = () => {
    if (!showPopup) return null

    // Show prompt sequence after first shot
    if (promptIndex !== null) {
      const prompts = [
        {
          id: 'club-data',
          content: (
            <p>
              That's your impact, captured by your CLM unit. Your <strong>Club Replay</strong> can be shown anytime here.
            </p>
          ),
          hoverText: 'Club Data',
        },
        {
          id: 'dispersion-view',
          content: (
          <>
            <p>
                This is the <strong>Dispersion View</strong>—critical for viewing consistency. You can
                cycle through Down Range and club impact data here.
            </p>
            <p>Go ahead and try clicking through.</p>
        </>
          ),
          hoverText: 'Dispersion View',
        },
        {
          id: 'data-panels',
          content: (
            <>
            <p>
              See the <strong>data panels?</strong> You can customize which panels show up, shot history, metrics bar or dual screen options. 
            </p>
            <p>Go ahead and try clicking through.</p>
            </>
          ),
          hoverText: 'Data Panels',
        },
      ]

      const currentPrompt = prompts[promptIndex]
      const buttonPosition = buttonPositions[currentPrompt.id]
      const showHoverCallout = hoveredButton === currentPrompt.id && buttonPosition

      // For prompts with mask elements, show tooltip near the element
      if (!buttonPosition) return null

      const spacing = 8
      const arrowHeight = 8
      const hoverTop = buttonPosition.top - spacing
      const tooltipTop = buttonPosition.top + buttonPosition.height + spacing + arrowHeight

      return (
        <>
          {/* Hover callout */}
          {showHoverCallout && currentPrompt.hoverText && (
            <Popup 
              position="custom"
              arrow="none" 
              className="popup--hover-callout"
              customPosition={{ 
                top: `${hoverTop}px`, 
                right: `${buttonPosition.right}px`,
              }}
            >
              <div 
                className="prompt-hover-callout"
                onMouseEnter={() => onButtonHover?.(currentPrompt.id)}
                onMouseLeave={() => onButtonHover?.(null)}
              >
                {currentPrompt.hoverText}
              </div>
            </Popup>
          )}

          {/* Main tooltip */}
          <Popup 
            position="custom"
            arrow="top" 
            customPosition={{ 
              top: `${tooltipTop}px`, 
              right: `${buttonPosition.right}px`,
            }}
          >
            <div className="feature-popup">
              {currentPrompt.content}
              <Button onClick={handleNextPrompt} className="feature-popup__button">
                Next
              </Button>
            </div>
          </Popup>
        </>
      )
    }

    // Show "complete 5 shots" message after all prompts
    if (showCompleteFiveShots) {
      return (
        <Popup position="center">
          <div className="feature-popup">
            <p>
              Great! Now that you understand how to view and contextualize your data, complete <strong>5 shots</strong> to build your baseline.
            </p>
            <Button 
              onClick={() => {
                setShowCompleteFiveShots(false)
                setShowPopup(false)
              }} 
              className="feature-popup__button"
            >
              Got it
            </Button>
          </div>
        </Popup>
      )
    }

    // Show popups for shots 2-5
    switch (popupContent) {
      case 'shot-2':
        return (
          <Popup position="center">
            <div className="feature-popup">
              <p>Shot 2 recorded. Keep going!</p>
            </div>
          </Popup>
        )
      case 'shot-3':
        return (
          <Popup position="center">
            <div className="feature-popup">
              <p>Shot 3 recorded. You're making progress!</p>
            </div>
          </Popup>
        )
      case 'shot-4':
        return (
          <Popup position="center">
            <div className="feature-popup">
              <p>Shot 4 recorded. One more to go!</p>
            </div>
          </Popup>
        )
      case 'shot-5':
        return (
          <Popup position="center">
            <div className="feature-popup">
              <p>Excellent! You've completed all 5 shots. Your data is ready for review.</p>
            </div>
          </Popup>
        )
      default:
        return null
    }
  }

  const narrative = getClubNarrative()

  return (
    <div className="five-shot-baseline">
      {/* Transparent narrative message after club selection */}
      {showNarrative && currentShot === 0 && (
        <Popup 
          position="custom" 
          className="club-narrative-popup"
          customPosition={{ 
            top: '38%',  // Slightly up from center (50% - 8%)
            left: '59%'  // Slightly right from center (50% + 5%)
          }}
        >
          <div className="club-narrative-message">
            <p>{narrative}</p>
          </div>
        </Popup>
      )}

      {/* Flight path animation - shows before impact cam */}
      {showFlightPath && (
        <FlightPathAnimation onComplete={handleFlightPathComplete} duration={2500} />
      )}

      {/* Ball placement - only show when not showing animations */}
      {!showFlightPath && !showImpactCam && (
        <BallPlacement
          key={ballKey}
          onPlaced={() => setBallPlaced(true)}
          position={{ top: '65%', left: '59.5%' }}
        />
      )}

      {showImpactCam && (
        <div className="impact-cam-overlay">
          <img src={impactCamImage} alt="Impact Cam" className="impact-cam-image" />
        </div>
      )}
      <div className="five-shot-baseline__progress">
        <div className="shot-counter">
          Shot {currentShot} of 5
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${(currentShot / 5) * 100}%` }}
          />
        </div>
      </div>
      <div className="five-shot-baseline__actions">
        <Button 
          onClick={handleRecordShot} 
          className="five-shot-baseline__shot-button"
          disabled={!ballPlaced}
        >
          Record Shot
        </Button>
        {currentShot > 0 && (
          <div className="shot-numbers">
            {Array.from({ length: currentShot }, (_, i) => (
              <span key={i} className="shot-number">({i + 1})</span>
            ))}
          </div>
        )}
      </div>
      {renderPopup()}
    </div>
  )
}

