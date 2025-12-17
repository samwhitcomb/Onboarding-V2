import React from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './ShotResultModal.css'

export const ShotResultModal: React.FC = () => {
  const { setCurrentStep } = useOnboarding()

  // Simulated shot result - in a real app this would come from shot data
  const distanceFromHole = 8 // feet
  const shotQuality = 'great'

  const handleContinue = () => {
    setCurrentStep('onboarding-complete')
  }

  return (
    <Modal className="shot-result-modal">
      <div className="shot-result-modal__content">
        <div className="shot-result-modal__icon">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="28" cy="28" r="26" stroke="var(--accent-green)" strokeWidth="2" fill="none" opacity="0.3"/>
            <circle cx="28" cy="28" r="18" stroke="var(--accent-green)" strokeWidth="2" fill="none" opacity="0.5"/>
            <circle cx="28" cy="28" r="10" stroke="var(--accent-green)" strokeWidth="2" fill="none" opacity="0.7"/>
            <circle cx="28" cy="28" r="4" fill="var(--accent-red)"/>
            <circle cx="32" cy="24" r="3" fill="var(--text-white)"/>
          </svg>
        </div>

        <h2 className="shot-result-modal__title">So Close!</h2>
        
        <div className="shot-result-modal__distance">
          <span className="shot-result-modal__distance-value">{distanceFromHole}</span>
          <span className="shot-result-modal__distance-unit">feet from the hole</span>
        </div>

        <p className="shot-result-modal__message">
          That was a {shotQuality} shot! The 7th at Pebble Beach has humbled many pros. 
          Keep practicing and that hole-in-one will come.
        </p>

        <div className="shot-result-modal__tip">
          <span className="shot-result-modal__tip-icon">💡</span>
          <p className="shot-result-modal__tip-text">
            Use the Practice Range to dial in your distances, or replay this hole 
            anytime in Course Play mode.
          </p>
        </div>

        <div className="shot-result-modal__actions">
          <Button onClick={handleContinue}>Continue</Button>
        </div>
      </div>
    </Modal>
  )
}

