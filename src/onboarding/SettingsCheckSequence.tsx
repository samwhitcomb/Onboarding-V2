import React, { useEffect, useState, useRef } from 'react'
import { Modal, Button, Popup, UIMask, RangeScreenElements } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import { useUserPreferences } from '../context/UserPreferencesContext'
import { SettingsModal } from './SettingsModal'
import './SettingsCheckSequence.css'

interface SettingsCheckSequenceProps {
  hoveredButton?: string | null
  onButtonHover?: (buttonId: string | null) => void
  onButtonClick?: (buttonId: string) => void
  onSettingsClick?: () => void
}

export const SettingsCheckSequence: React.FC<SettingsCheckSequenceProps> = ({
  hoveredButton,
  onButtonHover,
  onButtonClick,
  onSettingsClick,
}) => {
  const { currentStep, setCurrentStep } = useOnboarding()
  const {
    distanceUnit,
    setDistanceUnit,
    speedUnit,
    setSpeedUnit,
    displayScreen,
    setDisplayScreen,
  } = useUserPreferences()
  
  const [selectedProjectorDisplay, setSelectedProjectorDisplay] = useState<number | null>(null)
  const [controlScreenDisplay, setControlScreenDisplay] = useState<number>(1)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [buttonPosition, setButtonPosition] = useState<{ top: number; right: number; width: number; height: number } | null>(null)
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [minimizeTarget, setMinimizeTarget] = useState<{ top: string; right: string } | null>(null)
  
  // Sync hover state - persistent while mouse is over button
  const showHoverCallout = hoveredButton === 'settings-button' && currentStep === 'settings-tooltip'
  
  // Handle settings button click
  const handleSettingsButtonClick = () => {
    if (currentStep === 'settings-tooltip') {
      setShowSettingsModal(true)
    }
  }
  
  // Calculate button position in viewport pixels
  useEffect(() => {
    if (currentStep !== 'settings-tooltip') return
    
    const calculateButtonPosition = () => {
      // Get the onboarding flow container
      const flowContainer = document.querySelector('.onboarding-flow')
      if (!flowContainer) return
      
      const containerRect = flowContainer.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerHeight = containerRect.height
      
      // Button percentages: top: 3%, right: 5%, width: 3%, height: 5.5%
      const buttonTopPercent = 3
      const buttonRightPercent = 5
      const buttonWidthPercent = 3
      const buttonHeightPercent = 5.5
      
      // Calculate absolute positions
      const top = (buttonTopPercent / 100) * containerHeight
      const right = (buttonRightPercent / 100) * containerWidth
      const width = (buttonWidthPercent / 100) * containerWidth
      const height = (buttonHeightPercent / 100) * containerHeight
      
      // Get viewport position (container position + relative position)
      setButtonPosition({
        top: containerRect.top + top,
        right: window.innerWidth - (containerRect.left + containerRect.width - right),
        width,
        height,
      })
    }
    
    calculateButtonPosition()
    window.addEventListener('resize', calculateButtonPosition)
    
    return () => {
      window.removeEventListener('resize', calculateButtonPosition)
    }
  }, [currentStep])
  
  useEffect(() => {
    if (currentStep !== 'settings-tooltip') return
    
    const handleSettingsClick = () => {
      setShowSettingsModal(true)
    }
    
    // Listen for settings button click event
    window.addEventListener('settings-button-click', handleSettingsClick)
    return () => {
      window.removeEventListener('settings-button-click', handleSettingsClick)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep === 'settings-check') {
      setCurrentStep('unit-preference')
    }
  }, [currentStep, setCurrentStep])

  const handleUnitPreferencesComplete = () => {
    setCurrentStep('display-confirmation')
  }

  const handleProjectorSelection = (displayNumber: number) => {
    setSelectedProjectorDisplay(displayNumber)
  }
  
  const handleConfirmProjector = () => {
    if (selectedProjectorDisplay !== null) {
      // Map the selected display number to the display preference
      // Display 1 = primary, other displays = secondary (simplified for now)
      if (selectedProjectorDisplay === 1) {
        setDisplayScreen('primary')
      } else {
        setDisplayScreen('secondary')
      }
      
      // Calculate target position for settings button (top-right area)
      // Settings button is at approximately top: 3.5%, right: 5.2%
      setMinimizeTarget({ top: '3.5%', right: '5.2%' })
      setIsMinimizing(true)
      
      // After animation completes, transition to next step
      setTimeout(() => {
        setIsMinimizing(false)
        setCurrentStep('settings-tooltip')
      }, 600)
    }
  }

  const handleSettingsTooltipClose = () => {
    setCurrentStep('club-selection-intro')
  }

  if (currentStep === 'unit-preference') {
    return (
      <Modal className="unit-preferences-modal">
        <div className="settings-modal">
          <h2 className="settings-modal__title">Unit Preferences</h2>
          <p className="settings-modal__body">
            Confirm your preferred units for different measurements:
          </p>
          <div className="unit-preferences">
            <div className="unit-preference-group">
              <label className="unit-preference-label">Distance</label>
              <div className="unit-preference-options">
                <button
                  className={`unit-option ${distanceUnit === 'yards' ? 'unit-option--active' : ''}`}
                  onClick={() => setDistanceUnit('yards')}
                >
                  Yards
                </button>
                <button
                  className={`unit-option ${distanceUnit === 'meters' ? 'unit-option--active' : ''}`}
                  onClick={() => setDistanceUnit('meters')}
                >
                  Meters
                </button>
              </div>
            </div>
            <div className="unit-preference-group">
              <label className="unit-preference-label">Speed</label>
              <div className="unit-preference-options">
                <button
                  className={`unit-option ${speedUnit === 'mph' ? 'unit-option--active' : ''}`}
                  onClick={() => setSpeedUnit('mph')}
                >
                  MPH
                </button>
                <button
                  className={`unit-option ${speedUnit === 'mps' ? 'unit-option--active' : ''}`}
                  onClick={() => setSpeedUnit('mps')}
                >
                  MPS
                </button>
                <button
                  className={`unit-option ${speedUnit === 'kph' ? 'unit-option--active' : ''}`}
                  onClick={() => setSpeedUnit('kph')}
                >
                  KPH
                </button>
              </div>
            </div>
          </div>
          <div className="settings-modal__actions">
            <Button onClick={handleUnitPreferencesComplete}>Continue</Button>
          </div>
        </div>
      </Modal>
    )
  }

  if (currentStep === 'display-confirmation') {
    return (
      <div className={`display-identification ${isMinimizing ? 'display-identification--minimizing' : ''}`}>
        <div className="display-identification__screen-number">1</div>
        
        <div 
          className={`display-identification__content ${isMinimizing ? 'display-identification__content--minimizing' : ''}`}
          style={isMinimizing && minimizeTarget ? {
            '--minimize-top': minimizeTarget.top,
            '--minimize-right': minimizeTarget.right,
          } as React.CSSProperties : undefined}
        >
          <h2 className="display-identification__title">Display Setup</h2>
          <p className="display-identification__instruction">
            Large numbers are now displayed on each of your connected screens.
          </p>
          <p className="display-identification__question">
            Which number do you see on your <strong>PROJECTOR</strong> screen?
          </p>
          
          <div className="display-grid">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className={`display-grid__item ${selectedProjectorDisplay === num ? 'display-grid__item--selected' : ''}`}
                onClick={() => handleProjectorSelection(num)}
              >
                <span className="display-grid__number">{num}</span>
                <span className="display-grid__label">Display {num}</span>
                {controlScreenDisplay === num && (
                  <span className="display-grid__control-label">(Control Screen)</span>
                )}
              </button>
            ))}
          </div>
          
          <div className="display-identification__actions">
            <Button 
              onClick={handleConfirmProjector}
              disabled={selectedProjectorDisplay === null}
            >
              Confirm Projector
            </Button>
          </div>
          
          <div className="display-identification__control-change">
            <button 
              className="control-screen-change-btn"
              onClick={() => setControlScreenDisplay(prev => prev === 3 ? 1 : prev + 1)}
            >
              Change Control Screen
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'settings-tooltip') {
    if (!buttonPosition) {
      // Wait for position calculation
      return null
    }
    
    const spacing = 8 // pixels (reduced for subtle hover callout)
    const arrowHeight = 8 // arrow height in pixels (for main tooltip)
    
    // Calculate hover callout position above button (in viewport pixels)
    const hoverTop = buttonPosition.top - spacing
    
    // Calculate main tooltip position below button (in viewport pixels)
    // Position it so the arrow points to the center of the button
    const tooltipTop = buttonPosition.top + buttonPosition.height + spacing + arrowHeight
    
    return (
      <>
        {/* Hover callout - persistent while mouse is over button */}
        {showHoverCallout && (
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
              className="settings-hover-callout"
              onMouseEnter={() => onButtonHover?.('settings-button')}
              onMouseLeave={() => onButtonHover?.(null)}
            >
              Settings
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
          <div className="settings-tooltip">
            <p>
              All remaining settings are set to default. If you need to switch screens or adjust
              resolution at any time, access the <strong>Settings icon</strong> located here.
            </p>
            <button className="settings-tooltip__close" onClick={handleSettingsTooltipClose}>
              Got it
            </button>
          </div>
        </Popup>
        
        {/* Settings Modal */}
        {showSettingsModal && (
          <SettingsModal onClose={() => {
            setShowSettingsModal(false)
            // Also advance past the settings tooltip when closing the modal
            handleSettingsTooltipClose()
          }} />
        )}
      </>
    )
  }

  return null
}

