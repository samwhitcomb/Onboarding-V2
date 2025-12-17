import React, { useEffect, useState } from 'react'
import { Popup } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './ClubSelectionTooltip.css'

interface ClubSelectionTooltipProps {
  hoveredButton?: string | null
  onButtonHover?: (buttonId: string | null) => void
}

export const ClubSelectionTooltip: React.FC<ClubSelectionTooltipProps> = ({
  hoveredButton,
  onButtonHover,
}) => {
  const { currentStep } = useOnboarding()
  const [buttonPosition, setButtonPosition] = useState<{ top: number; right: number; width: number; height: number } | null>(null)

  // Sync hover state - persistent while mouse is over button
  const showHoverCallout = hoveredButton === 'club-selection-button' && currentStep === 'club-selection-tooltip'

  // Calculate button position in viewport pixels
  useEffect(() => {
    if (currentStep !== 'club-selection-tooltip') return
    
    const calculateButtonPosition = () => {
      // Get the onboarding flow container
      const flowContainer = document.querySelector('.onboarding-flow')
      if (!flowContainer) return
      
      const containerRect = flowContainer.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerHeight = containerRect.height
      
      // Button percentages: top: 66.5%, left: 19%, width: 6%, height: 6%
      const buttonTopPercent = 66.5
      const buttonLeftPercent = 19
      const buttonWidthPercent = 6
      const buttonHeightPercent = 6
      
      // Calculate absolute positions
      const top = (buttonTopPercent / 100) * containerHeight
      const left = (buttonLeftPercent / 100) * containerWidth
      const width = (buttonWidthPercent / 100) * containerWidth
      const height = (buttonHeightPercent / 100) * containerHeight
      
      // Get viewport position
      setButtonPosition({
        top: containerRect.top + top,
        right: window.innerWidth - (containerRect.left + left + width),
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

  if (!buttonPosition) {
    return null
  }

  const spacing = 8 // pixels (reduced for subtle hover callout)
  const arrowHeight = 8 // arrow height in pixels (for main tooltip)
  
  // Calculate hover callout position above button (in viewport pixels)
  const hoverTop = buttonPosition.top - spacing
  
  // Calculate main tooltip position below button (in viewport pixels)
  // Adjust these offsets to fine-tune tooltip position:
  const tooltipTopOffset = -200 // Adjust vertical offset (positive = down, negative = up)
  const tooltipRightOffset = -400 // Adjust horizontal offset (positive = left, negative = right)
  const tooltipTop = buttonPosition.top + buttonPosition.height + spacing + arrowHeight + tooltipTopOffset
  const tooltipRight = buttonPosition.right + tooltipRightOffset

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
            className="club-selection-hover-callout"
            onMouseEnter={() => onButtonHover?.('club-selection-button')}
            onMouseLeave={() => onButtonHover?.(null)}
          >
            Club Selection
          </div>
        </Popup>
      )}
      
      {/* Main tooltip */}
      <Popup 
        position="custom"
        arrow="top" 
        customPosition={{ 
          top: `${tooltipTop}px`, 
          right: `${tooltipRight}px`,
        }}
      >
        <div className="club-selection-tooltip">
          <p>
            Click the <strong>Club Selection</strong> button to choose your club.
          </p>
        </div>
      </Popup>
    </>
  )
}

