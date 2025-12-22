import React, { useState } from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './TutorialTargetRange.css'

type Phase = 'intro' | 'features' | 'complete'

export const TutorialTargetRange: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const [phase, setPhase] = useState<Phase>('intro')

  const handleSkip = () => {
    localStorage.setItem('tutorial-target-range', 'true')
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
    localStorage.setItem('tutorial-target-range', 'true')
    setCurrentStep('complete')
  }

  return (
    <Modal className="tutorial-target-range">
      <div className="tutorial-target-range__content">
        {phase === 'intro' && (
          <>
            <h2 className="tutorial-target-range__title">Welcome to Target Range</h2>
            <p className="tutorial-target-range__description">
              Test your accuracy with precision target challenges. Each shot is scored using Strokes Gained 
              analysis to help you understand your performance relative to professional standards.
            </p>
            <div className="tutorial-target-range__features">
              <div className="tutorial-target-range__feature">
                <strong>Strokes Gained:</strong> See how your shots compare to professional benchmarks.
              </div>
              <div className="tutorial-target-range__feature">
                <strong>Target Selection:</strong> Choose from various target sizes and distances.
              </div>
              <div className="tutorial-target-range__feature">
                <strong>Performance Tracking:</strong> Track your improvement over time with detailed analytics.
              </div>
            </div>
          </>
        )}

        {phase === 'features' && (
          <>
            <h2 className="tutorial-target-range__title">Key Features</h2>
            <div className="tutorial-target-range__tips">
              <div className="tutorial-target-range__tip">
                <h3>Strokes Gained Score</h3>
                <p>Each shot receives a Strokes Gained value. Positive values mean you're performing better than average.</p>
              </div>
              <div className="tutorial-target-range__tip">
                <h3>Target Zones</h3>
                <p>Different target zones award different points. Closer to center = better score.</p>
              </div>
              <div className="tutorial-target-range__tip">
                <h3>Session Analytics</h3>
                <p>Review your session performance with comprehensive statistics and trends.</p>
              </div>
            </div>
          </>
        )}

        <div className="tutorial-target-range__actions">
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


