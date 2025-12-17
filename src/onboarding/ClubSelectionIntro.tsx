import React from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './ClubSelectionIntro.css'

export const ClubSelectionIntro: React.FC = () => {
  const { setCurrentStep } = useOnboarding()

  const handleContinue = () => {
    setCurrentStep('club-selection-tooltip')
  }

  return (
    <Modal className="club-selection-intro-modal">
      <div className="club-selection-intro-modal__content">
        <h2 className="club-selection-intro-modal__title">Build Your Baseline</h2>
        <div className="club-selection-intro-modal__body">
          <p>
            You're about to create your first data baseline. This will help you understand your club performance and build your virtual bag.
          </p>
          <p>
            <strong>First, choose your club</strong> from the selection menu.
          </p>
        </div>
        <div className="club-selection-intro-modal__actions">
          <Button variant="primary" onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  )
}

