import React from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import { useShotData } from '../context/ShotDataContext'
import dispersionImage from '../assets/images/Dispersion.png'
import './PersonalizedPrepModal.css'

export const PersonalizedPrepModal: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const { getAverageData } = useShotData()
  const averageData = getAverageData()

  // Determine shot bias from average launch direction
  const launchDirection = averageData?.launchDirection || 0
  const shotBias = launchDirection > 1 ? 'fade' : launchDirection < -1 ? 'draw' : 'straight'

  return (
    <Modal className="personalized-prep-modal">
      <div className="personalized-prep-modal__content">
        <h2 className="personalized-prep-modal__title">Hole 7 - Par 3</h2>
        <div className="personalized-prep-modal__hole-info">
          <p className="personalized-prep-modal__description">
            The iconic 7th hole at Pebble Beach. A short par 3 over the Pacific Ocean.
          </p>
        </div>
        <div className="personalized-prep-modal__tip">
          <h3 className="personalized-prep-modal__tip-title">Final Advice:</h3>
          <div className="personalized-prep-modal__dispersion">
            <img 
              src={dispersionImage} 
              alt="Your shot dispersion pattern" 
              className="personalized-prep-modal__dispersion-image"
            />
            <p className="personalized-prep-modal__dispersion-label">Your Shot Dispersion</p>
          </div>
          <p className="personalized-prep-modal__tip-text">
            Based on your dispersion pattern, you tend to <strong>Slice</strong> the ball slightly. 
            Adjust your aim to account for the easterly wind coming off the Pacific.
          </p>
        </div>
        <div className="personalized-prep-modal__actions">
          <Button onClick={() => setCurrentStep('challenge-shot')}>Take the Shot</Button>
        </div>
      </div>
    </Modal>
  )
}

