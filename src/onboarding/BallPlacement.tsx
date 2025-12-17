import React, { useState, useEffect } from 'react'
import './BallPlacement.css'

interface BallPlacementProps {
  onPlaced: () => void
  position?: { top: string; left: string }
}

type PlacementState = 'unplaced' | 'placing' | 'placed'

export const BallPlacement: React.FC<BallPlacementProps> = ({
  onPlaced,
  position = { top: '85%', left: '50%' },
}) => {
  const [state, setState] = useState<PlacementState>('unplaced')

  useEffect(() => {
    // Automatic sequence: unplaced -> placing -> placed
    if (state === 'unplaced') {
      // Show red ring for 1.5 seconds, then transition to green
      const timer = setTimeout(() => {
        setState('placing')
      }, 1500)
      return () => clearTimeout(timer)
    } else if (state === 'placing') {
      // Transition to green ring, then fade
      const timer = setTimeout(() => {
        setState('placed')
        // Call onPlaced after fade animation completes
        setTimeout(() => {
          onPlaced()
        }, 1000) // After fade animation (1s)
      }, 500) // Hold green at full opacity for 0.5s
      return () => clearTimeout(timer)
    }
  }, [state, onPlaced])

  return (
    <div 
      className={`ball-placement ball-placement--${state}`}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {/* Red ring - shown when unplaced */}
      {state === 'unplaced' && (
        <div className="ball-placement__ring ball-placement__ring--red" />
      )}
      
      {/* Green ring / progress - shown when placing or placed */}
      {(state === 'placing' || state === 'placed') && (
        <>
          <div className={`ball-placement__ring ball-placement__ring--green ball-placement__ring--${state}`} />
          <svg className="ball-placement__progress" viewBox="0 0 48 48">
            <circle
              className={`ball-placement__progress-circle ball-placement__progress-circle--${state}`}
              cx="24"
              cy="24"
              r="20"
            />
          </svg>
        </>
      )}
      
      {/* White ball circle */}
      <div className="ball-placement__ball" />
    </div>
  )
}

