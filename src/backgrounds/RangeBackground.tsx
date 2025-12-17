import React from 'react'
import rangeImage from '../assets/images/Range screen.png'
import './Background.css'
import './RangeBackground.css'

interface RangeBackgroundProps {
  maskElements?: Array<{
    id: string
    top: number    // Percentage of image (0-100)
    left?: number
    right?: number
    width: number
    height: number
    highlight?: boolean
    mode?: 'spotlight' // 'spotlight' = clear inside, dark/blur outside
  }>
  onButtonHover?: (buttonId: string | null) => void
  onButtonClick?: (buttonId: string) => void
}

type MaskElement = NonNullable<RangeBackgroundProps['maskElements']>[number]

export const RangeBackground: React.FC<RangeBackgroundProps> = ({ 
  maskElements = [],
  onButtonHover,
  onButtonClick,
}) => {
  const calculateMaskStyle = (element: MaskElement) => {
    const style: React.CSSProperties = {
      width: `${element.width}%`,
      height: `${element.height}%`,
    }

    if (element.top !== undefined) {
      style.top = `${element.top}%`
    }

    if (element.left !== undefined) {
      style.left = `${element.left}%`
    }

    if (element.right !== undefined) {
      style.right = `${element.right}%`
    }

    return style
  }

  const hasSpotlight = maskElements.some(el => el.mode === 'spotlight')

  // Generate clip-path to cut holes in the dark overlay
  const generateClipPath = () => {
    const spotlights = maskElements.filter(el => el.mode === 'spotlight')
    if (spotlights.length === 0) return undefined

    // Create a polygon that covers everything except the spotlight rectangles
    const holes = spotlights.map(el => {
      const x = el.left !== undefined ? el.left : (100 - (el.right || 0) - el.width)
      const y = el.top || 0
      const x2 = x + el.width
      const y2 = y + el.height
      
      return `polygon(0% 0%, 0% 100%, ${x}% 100%, ${x}% ${y}%, ${x2}% ${y}%, ${x2}% ${y2}%, ${x}% ${y2}%, ${x}% 100%, 100% 100%, 100% 0%)`
    })

    return holes[0] // Use first hole (can be extended for multiple)
  }

  return (
    <div className="background background--range">
      <div className="range-image-container">
        <img 
          src={rangeImage} 
          alt="Range Screen" 
          className="background__image range-image" 
        />
        {maskElements.length > 0 && hasSpotlight && (
          <>
            {/* Dark blur overlay with cutout */}
            <div 
              className="range-spotlight-layer"
              style={{ clipPath: generateClipPath() }}
            />

            {/* Glowing borders for spotlight areas - just stroke, no fill */}
            <div className="range-mask-overlay">
              {maskElements
                .filter(el => el.highlight && el.mode === 'spotlight')
                .map((element) => (
              <div
                    key={element.id}
                    className="range-mask-element--spotlight-border"
                    style={calculateMaskStyle(element)}
                    onMouseEnter={() => onButtonHover?.(element.id)}
                    onMouseLeave={() => onButtonHover?.(null)}
                    onClick={(e) => {
                      e.stopPropagation()
                      onButtonClick?.(element.id)
                    }}
                  />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
