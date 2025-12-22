import React, { useState } from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './TutorialPractice.css'

type Phase = 'intro' | 'features' | 'complete'

export const TutorialPractice: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const [phase, setPhase] = useState<Phase>('intro')

  const handleSkip = () => {
    // Mark tutorial as seen
    localStorage.setItem('tutorial-practice', 'true')
    // Start the practice flow
    setCurrentStep('settings-check')
  }

  const handleNext = () => {
    if (phase === 'intro') {
      setPhase('features')
    } else if (phase === 'features') {
      handleComplete()
    }
  }

  const handleComplete = () => {
    // Mark tutorial as seen
    localStorage.setItem('tutorial-practice', 'true')
    // Start the practice flow
    setCurrentStep('settings-check')
  }

  return (
    <Modal className="tutorial-practice">
      <div className="tutorial-practice__content">
        {phase === 'intro' && (
          <>
            <h2 className="tutorial-practice__title">Welcome to Practice Mode</h2>
            <p className="tutorial-practice__description">
              Practice mode gives you unlimited shots with instant feedback. Perfect for working on your swing, 
              testing different clubs, and building your baseline data.
            </p>
            <div className="tutorial-practice__features">
              <div className="tutorial-practice__feature">
                <strong>Unlimited Shots:</strong> Take as many shots as you need to dial in your technique.
              </div>
              <div className="tutorial-practice__feature">
                <strong>Real-Time Data:</strong> See ball speed, launch angle, spin rate, and more instantly.
              </div>
              <div className="tutorial-practice__feature">
                <strong>Club Selection:</strong> Switch between clubs to build your complete bag profile.
              </div>
            </div>
          </>
        )}

        {phase === 'features' && (
          <>
            <h2 className="tutorial-practice__title">Key Features</h2>
            <div className="tutorial-practice__tips">
              <div className="tutorial-practice__tip">
                <h3>Shot Data Panel</h3>
                <p>View detailed metrics for each shot including carry distance, total distance, and dispersion.</p>
              </div>
              <div className="tutorial-practice__tip">
                <h3>Dispersion View</h3>
                <p>See where your shots land to identify patterns and improve consistency.</p>
              </div>
              <div className="tutorial-practice__tip">
                <h3>Session History</h3>
                <p>All your practice sessions are automatically saved to your Sessions page.</p>
              </div>
            </div>
          </>
        )}

        <div className="tutorial-practice__actions">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Tutorial
          </Button>
          <Button variant="primary" onClick={handleNext}>
            {phase === 'features' ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}


