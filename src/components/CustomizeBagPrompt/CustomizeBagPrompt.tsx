import React, { useEffect, useState, useRef } from 'react'
import './CustomizeBagPrompt.css'

interface CustomizeBagPromptProps {
  onDismiss?: () => void
  targetSelector?: string
}

export const CustomizeBagPrompt: React.FC<CustomizeBagPromptProps> = ({ 
  onDismiss,
  targetSelector = '#my-bag-section'
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const promptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Calculate position relative to My Bag widget
    const updatePosition = () => {
      const targetElement = document.querySelector(targetSelector) as HTMLElement
      const promptElement = promptRef.current
      
      if (!targetElement) return
      
      const targetRect = targetElement.getBoundingClientRect()
      
      if (promptElement) {
        // Use actual rendered dimensions
        const promptRect = promptElement.getBoundingClientRect()
        const promptHeight = promptRect.height
        const promptWidth = promptRect.width
        
        // Position above the My Bag widget, perfectly centered horizontally
        // Match the horizontal center of the My Bag box exactly
        const spacing = 20
        const targetCenterX = targetRect.left + (targetRect.width / 2)
        const promptCenterX = promptWidth / 2
        
        const top = targetRect.top - promptHeight - spacing
        const left = targetCenterX - promptCenterX
        
        setPosition({
          top: Math.max(20, top), // Ensure it's not too close to top of viewport
          left: Math.max(20, Math.min(left, window.innerWidth - promptWidth - 20)), // Keep within viewport
        })
      } else {
        // Fallback: use estimated dimensions if prompt not yet rendered
        // Use the content's min-width from CSS (400px)
        const estimatedPromptHeight = 100
        const estimatedPromptWidth = 400
        
        const targetCenterX = targetRect.left + (targetRect.width / 2)
        const promptCenterX = estimatedPromptWidth / 2
        
        setPosition({
          top: targetRect.top - estimatedPromptHeight - 20,
          left: targetCenterX - promptCenterX,
        })
      }
    }

    // Initial position - wait a bit for DOM to be ready
    const timer = setTimeout(updatePosition, 100)
    
    // Also update after a short delay to ensure prompt is rendered
    const timer2 = setTimeout(updatePosition, 300)
    
    // Update again after prompt is fully rendered
    const timer3 = setTimeout(updatePosition, 500)
    
    // Set up observers after prompt is rendered
    const timer4 = setTimeout(() => {
      const targetElement = document.querySelector(targetSelector) as HTMLElement
      const promptElement = promptRef.current
      
      // Use ResizeObserver to watch for both target and prompt size changes
      if (targetElement) {
        const targetResizeObserver = new ResizeObserver(() => {
          requestAnimationFrame(updatePosition)
        })
        targetResizeObserver.observe(targetElement)
        
        // Store observer for cleanup
        ;(targetElement as any)._resizeObserver = targetResizeObserver
      }
      
      if (promptElement) {
        const promptResizeObserver = new ResizeObserver(() => {
          requestAnimationFrame(updatePosition)
        })
        promptResizeObserver.observe(promptElement)
        
        // Store observer for cleanup
        ;(promptElement as any)._resizeObserver = promptResizeObserver
      }
    }, 600)

    // Update on scroll/resize
    const handleUpdate = () => {
      requestAnimationFrame(updatePosition)
    }

    window.addEventListener('scroll', handleUpdate, true)
    window.addEventListener('resize', handleUpdate)
    
    // Use MutationObserver to watch for layout changes
    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(updatePosition)
    })
    
    if (document.body) {
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      })
    }

    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)
      
      // Clean up observers
      const targetElement = document.querySelector(targetSelector) as HTMLElement
      const promptElement = promptRef.current
      
      if (targetElement && (targetElement as any)._resizeObserver) {
        (targetElement as any)._resizeObserver.disconnect()
      }
      if (promptElement && (promptElement as any)._resizeObserver) {
        (promptElement as any)._resizeObserver.disconnect()
      }
      
      mutationObserver.disconnect()
    }
  }, [targetSelector])

  // Removed auto-dismiss - prompt should stay visible until user dismisses it

  const handleDismiss = () => {
    setIsVisible(false)
    if (onDismiss) {
      setTimeout(onDismiss, 500) // Wait for fade out animation
    }
  }

  if (!isVisible) {
    return null
  }

  // Fallback to center if position not calculated yet
  const style = position && position.top > 0 ? {
    position: 'fixed' as const,
    top: `${Math.max(20, position.top)}px`,
    left: `${Math.max(20, Math.min(position.left, window.innerWidth - 420))}px`,
    transform: 'none',
  } : {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }

  return (
    <div 
      ref={promptRef}
      className="customize-bag-prompt"
      style={style}
    >
      <div className="customize-bag-prompt__content">
        <div className="customize-bag-prompt__icon">🎒</div>
        <div className="customize-bag-prompt__text">
          <p className="customize-bag-prompt__title">Customize your clubs in My Bag</p>
          <p className="customize-bag-prompt__subtitle">Click here to add and customize your clubs</p>
        </div>
        <button 
          className="customize-bag-prompt__close"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      {/* Arrow pointing down to My Bag */}
      <div className="customize-bag-prompt__arrow"></div>
    </div>
  )
}

