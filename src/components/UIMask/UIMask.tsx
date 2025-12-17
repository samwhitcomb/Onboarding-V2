import React, { createPortal, useEffect, useState, useRef } from 'react'
import './UIMask.css'

export interface UIElementRegion {
  id: string
  // These are percentages of the ORIGINAL IMAGE dimensions (0-100)
  top?: number
  left?: number
  right?: number
  bottom?: number
  width: number
  height: number
  highlight?: boolean
}

interface UIMaskProps {
  elements: UIElementRegion[]
  mode?: 'mask' | 'highlight' | 'both'
}

interface ImageDisplayInfo {
  displayedWidth: number
  displayedHeight: number
  offsetX: number
  offsetY: number
  scale: number
}

const calculateImageDisplayInfo = (img: HTMLImageElement, container: HTMLElement): ImageDisplayInfo => {
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight
  const naturalWidth = img.naturalWidth
  const naturalHeight = img.naturalHeight
  
  const containerAspect = containerWidth / containerHeight
  const imageAspect = naturalWidth / naturalHeight
  
  let scale: number
  let displayedWidth: number
  let displayedHeight: number
  let offsetX: number
  let offsetY: number
  
  if (imageAspect > containerAspect) {
    // Image is wider - height fills container, width overflows
    scale = containerHeight / naturalHeight
    displayedHeight = containerHeight
    displayedWidth = naturalWidth * scale
    offsetX = (containerWidth - displayedWidth) / 2
    offsetY = 0
  } else {
    // Image is taller - width fills container, height overflows
    scale = containerWidth / naturalWidth
    displayedWidth = containerWidth
    displayedHeight = naturalHeight * scale
    offsetX = 0
    offsetY = (containerHeight - displayedHeight) / 2
  }
  
  return {
    displayedWidth,
    displayedHeight,
    offsetX,
    offsetY,
    scale,
  }
}

export const UIMask: React.FC<UIMaskProps> = ({ elements, mode = 'mask' }) => {
  const [backgroundElement, setBackgroundElement] = useState<HTMLElement | null>(null)
  const [imageInfo, setImageInfo] = useState<ImageDisplayInfo | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    // Find the background container and image
    const container = document.querySelector('.background--range') || document.querySelector('.background')
    const img = container?.querySelector('.background__image') as HTMLImageElement
    
    if (!container || !img) return
    
    setBackgroundElement(container as HTMLElement)
    
    const updateImageInfo = () => {
      if (img.complete && img.naturalWidth > 0) {
        const info = calculateImageDisplayInfo(img, container as HTMLElement)
        setImageInfo(info)
      } else {
        // Wait for image to load
        img.onload = () => {
          const info = calculateImageDisplayInfo(img, container as HTMLElement)
          setImageInfo(info)
        }
      }
    }
    
    updateImageInfo()
    
    // Watch for window resize
    const handleResize = () => {
      updateImageInfo()
    }
    
    window.addEventListener('resize', handleResize)
    
    // Use ResizeObserver for more accurate tracking
    resizeObserverRef.current = new ResizeObserver(() => {
      updateImageInfo()
    })
    resizeObserverRef.current.observe(container)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  if (!elements || elements.length === 0 || !imageInfo || !backgroundElement) return null

  const maskContent = (
    <div className="ui-mask">
      {elements.map((element) => {
        // Get natural image dimensions
        const img = backgroundElement.querySelector('.background__image') as HTMLImageElement
        const naturalWidth = img?.naturalWidth || 1920
        const naturalHeight = img?.naturalHeight || 1080
        
        // Width and height are percentages of original image dimensions - calculate first
        const width = (element.width / 100) * naturalWidth * imageInfo.scale
        const height = (element.height / 100) * naturalHeight * imageInfo.scale
        
        // Convert percentage of original image to pixels in displayed image
        // Percentage values are relative to the ORIGINAL image dimensions
        let top: number | undefined
        let left: number | undefined
        let right: number | undefined
        let bottom: number | undefined
        
        if (element.top !== undefined) {
          // Top: percentage from top of original image
          // Original pixel position = (percentage / 100) * naturalHeight
          // Scaled position = original pixel * scale
          // Final position = offsetY + scaled position
          top = imageInfo.offsetY + (element.top / 100) * naturalHeight * imageInfo.scale
        }
        if (element.left !== undefined) {
          // Left: percentage from left of original image
          left = imageInfo.offsetX + (element.left / 100) * naturalWidth * imageInfo.scale
        }
        if (element.right !== undefined) {
          // Right: percentage from right edge of original image
          // Position from left = (1 - percentage/100) * naturalWidth * scale + offsetX
          const leftPosition = imageInfo.offsetX + (1 - element.right / 100) * naturalWidth * imageInfo.scale
          const containerWidth = (backgroundElement as HTMLElement).clientWidth
          right = containerWidth - leftPosition - width
        }
        if (element.bottom !== undefined) {
          // Bottom: percentage from bottom edge of original image
          const topPosition = imageInfo.offsetY + (1 - element.bottom / 100) * naturalHeight * imageInfo.scale
          const containerHeight = (backgroundElement as HTMLElement).clientHeight
          bottom = containerHeight - topPosition - height
        }
        
        return (
          <div
            key={element.id}
            className={`ui-mask__element ${
              element.highlight ? 'ui-mask__element--highlight' : ''
            } ${mode === 'highlight' ? 'ui-mask__element--highlight-only' : ''}`}
            style={{
              top: top !== undefined ? `${top}px` : undefined,
              left: left !== undefined ? `${left}px` : undefined,
              right: right !== undefined ? `${right}px` : undefined,
              bottom: bottom !== undefined ? `${bottom}px` : undefined,
              width: `${width}px`,
              height: `${height}px`,
            }}
          />
        )
      })}
    </div>
  )

  return createPortal(maskContent, backgroundElement)
}

// Predefined UI element regions for the range screen
// Use PERCENTAGE values (0-100) relative to the ORIGINAL IMAGE dimensions
// This ensures the mask scales correctly with the image regardless of viewport size
// To find coordinates: measure button position in image, divide by image dimensions, multiply by 100
// Example: if button is 85px from right in 1920px image = 85/1920 * 100 = 4.4
export const RangeScreenElements: Record<string, UIElementRegion> = {
  settingsButton: {
    id: 'settings-button',
    top: 0.95,    // Percentage of original image height (0-100)
    right: 4.4,  // Percentage of original image width from right edge
    width: 2.5,  // Percentage of original image width
    height: 4.4, // Percentage of original image height
  },
  // Add more elements as needed
  // Example: backButton: { id: 'back-button', top: 5, left: 3, width: 2.5, height: 4.4 },
  // Example: targetButton: { id: 'target-button', top: 5, right: 6, width: 4, height: 4.4 },
}

