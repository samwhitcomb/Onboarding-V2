import React from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './WelcomeModal.css'

export const WelcomeModal: React.FC = () => {
  const { setCurrentStep } = useOnboarding()

  const handleStartGuided = () => {
    setCurrentStep('flight-plans-intro')
  }

  const handleExploreFreely = () => {
    setCurrentStep('complete')
  }

  return (
    <Modal className="welcome-modal">
      <div className="welcome-modal__content">
        <h1 className="welcome-modal__headline">
          Welcome to the SuperApp: Your Game Upgrade Begins Now.
        </h1>
        <div className="welcome-modal__body">
          <p>
            Congratulations! Your Rapsodo CLM unit is connected, calibrated, and ready for
            high-precision performance. The hardware is set. Now, let us introduce you to the full
            power of the SuperApp software.
          </p>
          <p className="welcome-modal__time">
            We've designed a quick, guided initiation to unlock the app's core features. The entire
            experience—from your first data session to your final high-stakes challenge—will take{' '}
            <strong>less than 10 minutes</strong>.
          </p>
        </div>
        <div className="welcome-modal__actions">
          <Button variant="primary" onClick={handleStartGuided}>
            Start Your Guided First Flight
          </Button>
          <Button variant="ghost" onClick={handleExploreFreely}>
            Explore Freely
          </Button>
        </div>
      </div>
    </Modal>
  )
}

