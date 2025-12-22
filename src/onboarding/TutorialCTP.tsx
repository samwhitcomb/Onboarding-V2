import React, { useState } from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './TutorialCTP.css'

type Phase = 'intro' | 'features' | 'complete'

export const TutorialCTP: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const [phase, setPhase] = useState<Phase>('intro')

  const handleSkip = () => {
    localStorage.setItem('tutorial-ctp', 'true')
    setCurrentStep('complete')
  }

  const handleNext = () => {
    if (phase === 'intro') {
      setPhase('features')
    } else if (phase === 'features') {
      handleComplete()
    }
  }

  const handleComplete = () => {
    localStorage.setItem('tutorial-ctp', 'true')
    setCurrentStep('complete')
  }

  return (
    <Modal className="tutorial-ctp">
      <div className="tutorial-ctp__content">
        {phase === 'intro' && (
          <>
            <h2 className="tutorial-ctp__title">Welcome to Closest to the Pin</h2>
            <p className="tutorial-ctp__description">
              Compete for the closest shot to the pin in this classic challenge. Test your accuracy 
              and compete against friends or your personal best.
            </p>
            <div className="tutorial-ctp__features">
              <div className="tutorial-ctp__feature">
                <strong>Challenge Mode:</strong> Take your best shot at getting closest to the pin.
              </div>
              <div className="tutorial-ctp__feature">
                <strong>Leaderboards:</strong> Compete with friends and see how you rank.
              </div>
              <div className="tutorial-ctp__feature">
                <strong>Personal Records:</strong> Track your best distances and improve over time.
              </div>
            </div>
          </>
        )}

        {phase === 'features' && (
          <>
            <h2 className="tutorial-ctp__title">Key Features</h2>
            <div className="tutorial-ctp__tips">
              <div className="tutorial-ctp__tip">
                <h3>Shot Tracking</h3>
                <p>Each shot is measured precisely to determine your distance from the pin.</p>
              </div>
              <div className="tutorial-ctp__tip">
                <h3>Competition</h3>
                <p>Challenge friends or compete against your personal best to improve your ranking.</p>
              </div>
              <div className="tutorial-ctp__tip">
                <h3>Statistics</h3>
                <p>View detailed statistics including average distance, best shot, and consistency metrics.</p>
              </div>
            </div>
          </>
        )}

        <div className="tutorial-ctp__actions">
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


