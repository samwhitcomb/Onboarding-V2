import React, { useEffect, useState } from 'react'
import './ExploreFreelyPrompt.css'

interface ExploreFreelyPromptProps {
  onDismiss?: () => void
}

export const ExploreFreelyPrompt: React.FC<ExploreFreelyPromptProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Reset visibility when component mounts
    setIsVisible(true)
    
    // Auto-dismiss after 15 seconds (increased from 10)
    // Don't call onDismiss on auto-dismiss, so it can show again when navigating back
    const timer = setTimeout(() => {
      setIsVisible(false)
      // Don't set exploreFreelyPromptSeen on auto-dismiss, so it can show again
      // Only set it when user explicitly dismisses
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    // Only set the seen flag when user explicitly dismisses (not on auto-dismiss)
    if (onDismiss) {
      setTimeout(() => {
        onDismiss()
        // Set the flag to prevent showing again after explicit dismissal
        localStorage.setItem('exploreFreelyPromptSeen', 'true')
      }, 500) // Wait for fade out animation
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="explore-freely-prompt">
      <div className="explore-freely-prompt__content">
        <div className="explore-freely-prompt__icon">🎯</div>
        <div className="explore-freely-prompt__text">
          <p className="explore-freely-prompt__title">Choose a play mode and get playing!</p>
          <p className="explore-freely-prompt__subtitle">Explore any feature you'd like to try</p>
        </div>
        <button 
          className="explore-freely-prompt__close"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  )
}

