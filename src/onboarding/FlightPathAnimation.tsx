import React, { useEffect, useState } from 'react'
import './FlightPathAnimation.css'

interface FlightPathAnimationProps {
  onComplete: () => void
  duration?: number // Animation duration in milliseconds
}

export const FlightPathAnimation: React.FC<FlightPathAnimationProps> = ({ 
  onComplete, 
  duration = 2500 
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const animationFrame = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)

      if (newProgress < 1) {
        requestAnimationFrame(animationFrame)
      } else {
        onComplete()
      }
    }
    requestAnimationFrame(animationFrame)
  }, [duration, onComplete])

  // Parabolic trajectory calculation
  // View from behind: ball travels away from viewer
  // Using projectile motion physics: y = -ax² + bx + c
  // For a realistic golf shot viewed from behind:
  // - Starts at bottom center
  // - Travels upward and outward (away from viewer)
  // - Follows a parabolic path
  // - Gets smaller as it goes away (depth perception)
  
  const calculatePosition = (t: number) => {
    // Normalized time (0 to 1)
    const normalizedT = Math.max(0, Math.min(1, progress))
    
    // Horizontal position: moves from center to right (away from viewer)
    // Starts at center, moves outward
    const startX = 0.5 // Start at center
    const endX = 0.75 // End at 75% of screen width
    const x = startX + (normalizedT * (endX - startX))
    
    // Vertical position: parabolic curve (projectile motion)
    // y = -a*t² + b*t + c
    // Peak at t=0.5, starts low, ends low
    const startY = 0.85 // Start near bottom (85% from top)
    const peakY = 0.35 // Peak height (35% from top)
    const endY = 0.75 // End position (75% from top)
    
    // Parabolic equation: y = a*t² + b*t + c
    // At t=0: y = startY = c
    // At t=0.5: y = peakY = a*0.25 + b*0.5 + c
    // At t=1: y = endY = a + b + c
    // Solving: a = 4*(startY + endY - 2*peakY), b = 4*(peakY - startY) - a, c = startY
    const a = 4 * (startY + endY - 2 * peakY)
    const b = 4 * (peakY - startY) - a
    const c = startY
    const y = a * normalizedT * normalizedT + b * normalizedT + c
    
    // Scale: gets smaller as it goes away (simulating depth)
    // Uses exponential decay for more realistic depth perception
    const minScale = 0.2
    const maxScale = 1.0
    const scale = maxScale - (Math.pow(normalizedT, 1.5) * (maxScale - minScale))
    
    // Rotation: slight spin effect (backspin)
    const rotation = normalizedT * 720 // Two full rotations
    
    return { x, y, scale, rotation }
  }

  const { x, y, scale, rotation } = calculatePosition(progress)

  // Calculate trail points for the parabolic path
  const trailPoints: Array<{ x: number; y: number; opacity: number; scale: number }> = []
  const trailLength = 20
  for (let i = 0; i < trailLength; i++) {
    const trailT = Math.max(0, progress - (i / trailLength) * 0.4)
    if (trailT > 0) {
      const { x: trailX, y: trailY, scale: trailScale } = calculatePosition(trailT)
      const opacity = (1 - i / trailLength) * 0.4
      trailPoints.push({ x: trailX, y: trailY, opacity, scale: trailScale })
    }
  }

  // Generate SVG path for the parabolic trajectory
  const generateFullPath = () => {
    const points: Array<{ x: number; y: number }> = []
    for (let t = 0; t <= 1; t += 0.02) {
      const normalizedT = t
      const startX = 0.5
      const endX = 0.75
      const x = startX + (normalizedT * (endX - startX))
      
      const startY = 0.85
      const peakY = 0.35
      const endY = 0.75
      const a = 4 * (startY + endY - 2 * peakY)
      const b = 4 * (peakY - startY) - a
      const c = startY
      const y = a * normalizedT * normalizedT + b * normalizedT + c
      
      points.push({ x: x * 100, y: y * 100 })
    }
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
    return pathD
  }

  // Generate path up to current progress for the red trace
  const generateTracePath = () => {
    const points: Array<{ x: number; y: number }> = []
    const steps = Math.ceil(progress * 50) // More points for smoother curve
    for (let i = 0; i <= steps; i++) {
      const t = i / 50
      const normalizedT = Math.min(t, progress)
      
      const startX = 0.5
      const endX = 0.75
      const x = startX + (normalizedT * (endX - startX))
      
      const startY = 0.85
      const peakY = 0.35
      const endY = 0.75
      const a = 4 * (startY + endY - 2 * peakY)
      const b = 4 * (peakY - startY) - a
      const c = startY
      const y = a * normalizedT * normalizedT + b * normalizedT + c
      
      points.push({ x: x * 100, y: y * 100 })
    }
    if (points.length > 0) {
      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
      return pathD
    }
    return ''
  }

  return (
    <div className="flight-path-animation">
      <svg className="flight-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Full trajectory path (faint background) */}
        <path
          className="flight-path-trajectory-background"
          d={generateFullPath()}
          fill="none"
          stroke="rgba(48, 209, 88, 0.1)"
          strokeWidth="0.3"
        />
        
        {/* Red trace curve following the ball */}
        <path
          className="flight-path-trace"
          d={generateTracePath()}
          fill="none"
          stroke="#CD1B32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      {/* Trail dots */}
      <div className="flight-path-trail">
        {trailPoints.map((point, index) => (
          <div
            key={index}
            className="flight-path-trail-dot"
            style={{
              left: `${point.x * 100}%`,
              top: `${point.y * 100}%`,
              opacity: point.opacity,
              transform: `translate(-50%, -50%) scale(${point.scale})`,
            }}
          />
        ))}
      </div>
      
      {/* Animated ball */}
      <div
        className="flight-path-ball"
        style={{
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        }}
      >
        <div className="flight-path-ball-inner" />
      </div>
    </div>
  )
}

