import React, { useState, useEffect, useRef } from 'react'
import { Popup, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import { FlightPathAnimation } from './FlightPathAnimation'
import { BallPlacement } from './BallPlacement'
import './CourseplayWarmup.css'

type Phase = 'scene-setting' | 'controls-intro' | 'waypoint-tooltip' | 'map-tooltip' | 'putting-tooltip' | 'playing'

export const CourseplayWarmup: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const [phase, setPhase] = useState<Phase>('scene-setting')
  const [showControlsIntro, setShowControlsIntro] = useState(false)
  const [currentShot, setCurrentShot] = useState(0)
  const [showTip, setShowTip] = useState(false)
  const [tipContent, setTipContent] = useState<string>('')
  const [showFlightPath, setShowFlightPath] = useState(false)
  const [ballPlaced, setBallPlaced] = useState(false)
  const [ballKey, setBallKey] = useState(0) // Key to reset ball component
  const [showBall, setShowBall] = useState(false)
  const [hoveredCourseView, setHoveredCourseView] = useState<string | null>(null)
  const [showPuttingTooltip, setShowPuttingTooltip] = useState(false)
  const currentShotRef = useRef(0)

  // Scene setting auto-advance
  useEffect(() => {
    if (phase === 'scene-setting') {
      const timer = setTimeout(() => {
        // Show the controls intro but keep scene setting visible
        setShowControlsIntro(true)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const handleControlsIntroNext = () => {
    // Hide scene setting when moving to waypoint tooltip
    setShowControlsIntro(false)
    setPhase('waypoint-tooltip')
  }

  const handleWaypointNext = () => {
    setPhase('map-tooltip')
  }

  const handleMapNext = () => {
    setPhase('playing')
    // Reset ball placement when entering playing phase
    setBallPlaced(false)
    setBallKey(prev => prev + 1)
    setShowBall(true)
  }

  const handlePuttingTooltipNext = () => {
    setPhase('playing')
  }

  const handleFireShot = () => {
    if (!ballPlaced) return // Don't fire if ball not placed
    // Hide any current tip before firing next shot
    setShowTip(false)
    setTipContent('')
    
    if (currentShot === 0) {
      // Fire first shot
      setCurrentShot(1)
      currentShotRef.current = 1
      setShowFlightPath(true)
      setShowBall(false)
      setBallPlaced(false)
    } else if (currentShot < 6) {
      // Fire next shot
      const nextShot = currentShot + 1
      setCurrentShot(nextShot)
      currentShotRef.current = nextShot
      setShowFlightPath(true)
      setShowBall(false)
      setBallPlaced(false)
    }
  }

  const handleFlightPathComplete = () => {
    setShowFlightPath(false)
    // Reset ball placement for next shot
    setBallPlaced(false)
    setBallKey(prev => prev + 1) // Reset ball component
    setTimeout(() => {
      setShowBall(true)
    }, 300)
    // Show putting tooltip when entering putting mode (shot 5) for the first time
    if (currentShot === 5 && phase === 'playing' && !showPuttingTooltip) {
      setShowPuttingTooltip(true)
      setPhase('putting-tooltip')
      return
    }
    // Show tip after flight path completes
    if (currentShot > 0) {
      setShowTip(true)
      setTipContent(`shot-${currentShot}`)
    }
    // If last shot, queue celebration
    if (currentShot >= 6) {
      setTimeout(() => {
        setCurrentStep('celebration')
      }, 500)
    }
  }

  const renderTip = () => {
    if (!showTip) return null

    switch (tipContent) {
      case 'shot-1':
        return (
          <Popup position="top" arrow="bottom" customPosition={{ top: '100px', left: '50%' }}>
            <div className="warmup-tip">
              <p>
                <strong>Driver Tip:</strong> Use your overhead map to plan your shot strategy and
                avoid hazards.
              </p>
            </div>
          </Popup>
        )
      case 'shot-2':
        return (
          <Popup position="center">
            <div className="warmup-tip">
              <p>
                <strong>Approach Tip:</strong> Notice how your 7-Iron data is automatically visible
                here, helping you make informed decisions.
              </p>
            </div>
          </Popup>
        )
      case 'shot-3':
        return (
          <Popup position="center">
            <div className="warmup-tip">
              <p>
                <strong>Mid-Iron Tip:</strong> Precision is key. Use the distance markers to dial in
                your approach.
              </p>
            </div>
          </Popup>
        )
      case 'shot-4':
        return (
          <Popup position="center">
            <div className="warmup-tip">
              <p>
                <strong>Wedge Tip:</strong> You're getting closer. Focus on accuracy and distance control.
              </p>
            </div>
          </Popup>
        )
      case 'shot-5':
        return (
          <Popup position="center">
            <div className="warmup-tip">
              <p>
                <strong>Short Game Tip:</strong> Fine-tune your approach. Every shot counts on a par 5.
              </p>
            </div>
          </Popup>
        )
      case 'shot-6':
        return (
          <Popup position="bottom" customPosition={{ bottom: '150px', left: '50%' }}>
            <div className="warmup-tip">
              <p>
                <strong>Putting Tip:</strong> Master the read: Use the putting grid to analyze
                break and speed.
              </p>
            </div>
          </Popup>
        )
      default:
        return null
    }
  }

  // Scene setting phase
  if (phase === 'scene-setting') {
    return (
      <div className="courseplay-warmup courseplay-warmup--scene-setting">
        <div className="scene-setting">
          <div className="scene-setting__content">
            <h2 className="scene-setting__title">Hole 7 at Pebble Beach</h2>
            <p className="scene-setting__subtitle">The most iconic par 3 in golf.</p>
            <p className="scene-setting__description">
              107 yards downhill to a green perched on the edge of Carmel Bay. 
              The wind swirls off the Pacific. One shot. No margin for error.
            </p>
          </div>
        </div>
        {showControlsIntro && (
          <div className="controls-intro controls-intro--overlay">
            <div className="controls-intro__content">
              <h3 className="controls-intro__title">Before You Tee Off</h3>
              <p className="controls-intro__description">
                Let's walk through the key controls that will help you navigate the course.
              </p>
              <Button onClick={handleControlsIntroNext}>Show Me</Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Waypoint tooltip phase
  if (phase === 'waypoint-tooltip') {
    return (
      <div className="courseplay-warmup courseplay-warmup--tooltip">
        <div className="tooltip-overlay">
          <div 
            className="tooltip-highlight tooltip-highlight--waypoint"
            onClick={handleWaypointNext}
          ></div>
          <div className="tooltip-callout tooltip-callout--waypoint">
            <h4>Waypoint Marker</h4>
            <p>
              Move the waypoint inside the minimap or tap anywhere on the course to adjust aiming.
            </p>
            <Button variant="secondary" onClick={handleWaypointNext}>Next</Button>
          </div>
        </div>
      </div>
    )
  }

  // Map tooltip phase
  if (phase === 'map-tooltip') {
    const courseViews = ['Green view', 'Flyover', 'From Ball', 'From tee']
    return (
      <div className="courseplay-warmup courseplay-warmup--tooltip">
        <div className="tooltip-overlay">
          <div className="tooltip-highlight tooltip-highlight--map">
            {courseViews.map((label, index) => (
              <div
                key={label}
                className="tooltip-highlight__row"
                onMouseEnter={() => setHoveredCourseView(label)}
                onMouseLeave={() => setHoveredCourseView(null)}
                onClick={handleMapNext}
              >
                {hoveredCourseView === label && (
                  <div className="tooltip-highlight__label">
                    {label}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="tooltip-callout tooltip-callout--map">
            <h4>Course Views</h4>
            <p>
              Use the preconfigured course views to visualise the shot and read the terrain.
            </p>
            <Button variant="secondary" onClick={handleMapNext}>Got It</Button>
          </div>
        </div>
      </div>
    )
  }

  // Putting tooltip phase
  if (phase === 'putting-tooltip') {
    return (
      <div className="courseplay-warmup courseplay-warmup--tooltip courseplay-warmup--putting">
        <div className="tooltip-overlay">
          <div 
            className="tooltip-highlight tooltip-highlight--putting"
            onClick={handlePuttingTooltipNext}
          ></div>
          <div className="tooltip-callout tooltip-callout--putting">
            <h4>Green Reading Tools</h4>
            <p>
              Use gridlines and slope indicators to analyze break and speed for your putt.
            </p>
            <Button variant="secondary" onClick={handlePuttingTooltipNext}>Got It</Button>
          </div>
        </div>
      </div>
    )
  }

  // Playing phase
  const isPutting = currentShot >= 5

  return (
    <div className={`courseplay-warmup ${isPutting ? 'courseplay-warmup--putting' : ''}`}>
      {showFlightPath && (
        <FlightPathAnimation onComplete={handleFlightPathComplete} />
      )}
      {phase === 'playing' && showBall && (
        <BallPlacement 
          key={ballKey}
          onPlaced={() => setBallPlaced(true)} 
        />
      )}
      <div className="courseplay-warmup__info">
        <div className="hole-info">
          <span className="hole-info__label">HOLE 7</span>
          <span className="hole-info__par">Par 3</span>
          <span className="hole-info__distance">107 yards</span>
        </div>
      </div>
      <div className="courseplay-warmup__progress">
        <div className="shot-counter">
          Shot {currentShot} of 6
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${(currentShot / 6) * 100}%` }}
          />
        </div>
      </div>
      <div className="courseplay-warmup__actions">
        <Button 
          onClick={handleFireShot} 
          className="courseplay-warmup__shot-button"
          disabled={!ballPlaced}
        >
          Fire Shot
        </Button>
        {currentShot > 0 && (
          <div className="shot-numbers">
            {Array.from({ length: currentShot }, (_, i) => (
              <span key={i} className="shot-number">({i + 1})</span>
            ))}
          </div>
        )}
      </div>
      {renderTip()}
    </div>
  )
}

