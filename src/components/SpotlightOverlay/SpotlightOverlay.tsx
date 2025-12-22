import React, { useEffect, useState } from 'react'
import './SpotlightOverlay.css'

interface SpotlightOverlayProps {
  targetSelector: string
  enabled: boolean
  strokeOnly?: boolean
}

export const SpotlightOverlay: React.FC<SpotlightOverlayProps> = ({ targetSelector, enabled, strokeOnly = false }) => {
  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [overlaySize, setOverlaySize] = useState<{ width: number; height: number } | null>(null)
  const overlayRef = React.useRef<HTMLDivElement>(null)

  // Set up overlay size tracking
  useEffect(() => {
    if (!enabled) {
      setOverlaySize(null)
      return
    }

    const updateOverlaySize = () => {
      if (overlayRef.current) {
        const overlayRect = overlayRef.current.getBoundingClientRect()
        setOverlaySize({
          width: overlayRect.width,
          height: overlayRect.height,
        })
      }
    }

    // Initial size
    updateOverlaySize()

    // Use ResizeObserver to track overlay size changes (including zoom)
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateOverlaySize)
    })

    if (overlayRef.current) {
      resizeObserver.observe(overlayRef.current)
    }

    // Also listen for window resize
    window.addEventListener('resize', updateOverlaySize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateOverlaySize)
    }
  }, [enabled])

  // Set up position tracking
  useEffect(() => {
    if (!enabled) {
      setPosition(null)
      return
    }

    const updatePosition = () => {
      const targetElement = document.querySelector(targetSelector) as HTMLElement
      const overlayElement = overlayRef.current
      
      if (targetElement && overlayElement) {
        const targetRect = targetElement.getBoundingClientRect()
        const overlayRect = overlayElement.getBoundingClientRect()
        
        // Calculate position relative to the overlay container
        // This ensures coordinates match the SVG coordinate system
        const top = targetRect.top - overlayRect.top
        const left = targetRect.left - overlayRect.left
        
        setPosition({
          top,
          left,
          width: targetRect.width,
          height: targetRect.height,
        })
      } else if (targetElement) {
        // Fallback if overlay not yet mounted - use viewport coordinates
        const rect = targetElement.getBoundingClientRect()
        setPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        })
      }
    }

    // Initial position - delay slightly to ensure overlay is mounted
    const timer = setTimeout(updatePosition, 0)

    // Update on scroll/resize
    const handleUpdate = () => {
      requestAnimationFrame(updatePosition)
    }

    window.addEventListener('scroll', handleUpdate, true)
    window.addEventListener('resize', handleUpdate)

    // Use MutationObserver to watch for layout changes
    const observer = new MutationObserver(handleUpdate)
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      })
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)
      observer.disconnect()
    }
  }, [targetSelector, enabled])

  if (!enabled || !position || !overlaySize) {
    return null
  }

  return (
    <div ref={overlayRef} className="spotlight-overlay">
      <svg 
        className="spotlight-overlay__svg" 
        width="100%" 
        height="100%"
        viewBox={`0 0 ${overlaySize.width} ${overlaySize.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="spotlight-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="spotlight-glow-outer" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
            </feMerge>
          </filter>
          {/* Mask to cut out the highlighted area from the dark overlay */}
          <mask id="spotlight-cutout">
            <rect width={overlaySize.width} height={overlaySize.height} fill="black" />
            <rect
              x={position.left}
              y={position.top}
              width={position.width}
              height={position.height}
              fill="white"
              rx="12"
            />
          </mask>
        </defs>
        {/* Dark overlay with mask to create hole - middle stays visible (only if not strokeOnly) */}
        {!strokeOnly && (
          <rect 
            width={overlaySize.width} 
            height={overlaySize.height} 
            fill="rgba(0, 0, 0, 0.7)" 
            mask="url(#spotlight-cutout)"
          />
        )}
        {/* Glowing border around highlighted area - outer soft glow */}
        <rect
          x={position.left - 4}
          y={position.top - 4}
          width={position.width + 8}
          height={position.height + 8}
          fill="none"
          stroke="#667eea"
          strokeWidth="2"
          strokeOpacity="0.3"
          filter="url(#spotlight-glow-outer)"
          rx="16"
        />
        {/* Glowing border around highlighted area - inner brighter glow */}
        <rect
          x={position.left - 2}
          y={position.top - 2}
          width={position.width + 4}
          height={position.height + 4}
          fill="none"
          stroke="#667eea"
          strokeWidth="2"
          strokeOpacity="0.7"
          filter="url(#spotlight-glow)"
          rx="14"
        />
      </svg>
    </div>
  )
}

