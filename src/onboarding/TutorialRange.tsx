import React, { useState } from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './TutorialRange.css'

type Phase = 'intro' | 'features' | 'complete'

export const TutorialRange: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const [phase, setPhase] = useState<Phase>('intro')

  const handleSkip = () => {
    localStorage.setItem('tutorial-range', 'true')
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
    localStorage.setItem('tutorial-range', 'true')
    setCurrentStep('complete')
  }

  return (
    <Modal className="tutorial-range">
      <div className="tutorial-range__content">
        {phase === 'intro' && (
          <>
            <h2 className="tutorial-range__title">Welcome to Range Mode</h2>
            <p className="tutorial-range__description">
              Experience a realistic driving range with advanced ball tracking and course-like conditions. 
              Perfect for warming up or working on specific shots.
            </p>
            <div className="tutorial-range__features">
              <div className="tutorial-range__feature">
                <strong>Realistic Environment:</strong> Practice on a virtual driving range with realistic terrain and conditions.
              </div>
              <div className="tutorial-range__feature">
                <strong>Advanced Tracking:</strong> Track every shot with precision and see detailed ball flight data.
              </div>
              <div className="tutorial-range__feature">
                <strong>Target Practice:</strong> Aim for specific targets to improve your accuracy and distance control.
              </div>
            </div>
          </>
        )}

        {phase === 'features' && (
          <>
            <h2 className="tutorial-range__title">Key Features</h2>
            <div className="tutorial-range__tips">
              <div className="tutorial-range__tip">
                <h3>Target Selection</h3>
                <p>Choose from multiple targets at different distances to practice various shot types.</p>
              </div>
              <div className="tutorial-range__tip">
                <h3>Shot Analysis</h3>
                <p>Review each shot's trajectory, distance, and landing position to refine your technique.</p>
              </div>
              <div className="tutorial-range__tip">
                <h3>Session Tracking</h3>
                <p>Monitor your progress over time with detailed session statistics.</p>
              </div>
            </div>
          </>
        )}

        <div className="tutorial-range__actions">
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


