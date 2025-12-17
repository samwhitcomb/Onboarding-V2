import React from 'react'
import launcherImage from '../assets/images/Launcher.png'
import './Background.css'
import './RangeBackground.css'

interface LauncherBackgroundProps {
  maskElements?: Array<{
    id: string
    top: number
    left?: number
    right?: number
    width: number
    height: number
    highlight?: boolean
    mode?: 'spotlight'
  }>
  onButtonHover?: (buttonId: string | null) => void
  onButtonClick?: (buttonId: string) => void
}

type MaskElement = NonNullable<LauncherBackgroundProps['maskElements']>[number]

export const LauncherBackground: React.FC<LauncherBackgroundProps> = ({ 
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

  const generateClipPath = () => {
    const spotlights = maskElements.filter(el => el.mode === 'spotlight')
    if (spotlights.length === 0) return undefined

    const holes = spotlights.map(el => {
      const x = el.left !== undefined ? el.left : (100 - (el.right || 0) - el.width)
      const y = el.top || 0
      const x2 = x + el.width
      const y2 = y + el.height
      
      return `polygon(0% 0%, 0% 100%, ${x}% 100%, ${x}% ${y}%, ${x2}% ${y}%, ${x2}% ${y2}%, ${x}% ${y2}%, ${x}% 100%, 100% 100%, 100% 0%)`
    })

    return holes[0]
  }

  return (
    <div className="background background--launcher">
      <div className="range-image-container">
        <img src={launcherImage} alt="Launcher" className="background__image" />
        {maskElements.length > 0 && hasSpotlight && (
          <>
            <div 
              className="range-spotlight-layer"
              style={{ clipPath: generateClipPath() }}
            />
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

