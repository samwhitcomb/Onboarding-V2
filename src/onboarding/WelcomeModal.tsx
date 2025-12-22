import React, { useState, useEffect } from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './WelcomeModal.css'

type WelcomeStep = 'intro' | 'flight-plans'

export const WelcomeModal: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const [step, setStep] = useState<WelcomeStep>('intro')

  // Dispatch event to OnboardingFlow to show mask on step 2
  useEffect(() => {
    if (step === 'flight-plans') {
      window.dispatchEvent(
        new CustomEvent('welcome-step-change', {
          detail: { step: 'flight-plans' },
        }),
      )
    } else {
      window.dispatchEvent(
        new CustomEvent('welcome-step-change', {
          detail: { step: 'intro' },
        }),
      )
    }
  }, [step])

  const handleNext = () => {
    setStep('flight-plans')
  }

  const handleOK = () => {
    setCurrentStep('complete')
  }

  return (
    <Modal className="welcome-modal">
      <div className="welcome-modal__content">
        {step === 'intro' && (
          <>
            <h1 className="welcome-modal__headline">
              Welcome to the SuperApp: Your Game Upgrade Begins Now.
            </h1>
            <div className="welcome-modal__body">
              <p>
                Congratulations! Your Rapsodo CLM unit is connected, calibrated, and ready for
                high-precision performance. The hardware is set. Now, let us introduce you to the full
                power of the SuperApp software.
              </p>
              {/* <p className="welcome-modal__time">
                We've designed a quick, guided initiation to unlock the app's core features. The entire
                experience—from your first data session to your final high-stakes challenge—will take{' '}
                <strong>less than 10 minutes</strong>.
              </p> */}
            </div>
            <div className="welcome-modal__actions">
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            </div>
          </>
        )}

        {step === 'flight-plans' && (
          <>
            <h1 className="welcome-modal__headline">
              Your Flight Plans
            </h1>
            <div className="welcome-modal__body">
              <p>
                Flight Plans act as a checklist to help you explore and master all the features of the SuperApp.
                You can access your Flight Plans anytime from the widget in the top right corner.
              </p>
              <p>
                Complete features in any order you like—either by following the Flight Plans or by 
                exploring the app independently. Your progress will be tracked automatically.
              </p>
            </div>
            <div className="welcome-modal__actions">
              <Button variant="primary" onClick={handleOK}>
                OK
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

