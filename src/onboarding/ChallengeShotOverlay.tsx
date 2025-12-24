import React, { useState } from 'react'
import { Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import { FlightPathAnimation } from './FlightPathAnimation'
import pebbleHole7Image from '../assets/images/Pebble Hole7.png'
import './ChallengeShotOverlay.css'

export const ChallengeShotOverlay: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const [showFlightPath, setShowFlightPath] = useState(false)

  const handleShotComplete = () => {
    setShowFlightPath(true)
  }

  const handleFlightPathComplete = () => {
    setShowFlightPath(false)
    setCurrentStep('shot-result')
  }

  return (
    <div className="challenge-shot-overlay">
      <img 
        src={pebbleHole7Image} 
        alt="Pebble Beach Hole 7" 
        className="challenge-shot-overlay__background"
      />
      {!showFlightPath && (
        <>
          <div className="challenge-shot-content">
            <div className="challenge-shot-content__header">
              <p className="challenge-shot-content__eyebrow">HOLE-IN-ONE Challenge</p>
              <h2 className="challenge-shot-content__title">Subscription on the line.</h2>
              <p className="challenge-shot-content__subtitle">Make history.</p>
            </div>
            
            <div className="challenge-shot-content__hole-info">
              <div className="hole-badge">HOLE 7</div>
              <div className="hole-details">
                <span className="hole-details__item">
                  <span className="hole-details__label">Par</span>
                  <span className="hole-details__value">3</span>
                </span>
                <span className="hole-details__divider"></span>
                <span className="hole-details__item">
                  <span className="hole-details__label">Distance</span>
                  <span className="hole-details__value">107 yds</span>
                </span>
              </div>
            </div>
            
            {/* <div className="challenge-shot-content__prize">
              <span className="challenge-shot-content__prize-icon">🏆</span>
              <span className="challenge-shot-content__prize-text">1 Year Rapsodo Golf Suite Membership</span>
            </div> */}
          </div>
          
          <div className="challenge-shot-actions">
            <Button onClick={handleShotComplete} className="challenge-shot-actions__button">
              Take Shot
            </Button>
          </div>
        </>
      )}
      {showFlightPath && (
        <FlightPathAnimation onComplete={handleFlightPathComplete} duration={2500} />
      )}
    </div>
  )
}

