import React, { useEffect } from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './CelebrationModal.css'

export const CelebrationModal: React.FC = () => {
  const { setCurrentStep } = useOnboarding()

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep('challenge-intro')
    }, 3000)

    return () => clearTimeout(timer)
  }, [setCurrentStep])

  return (
    <Modal className="celebration-modal">
      <div className="celebration-modal__content">
        <div className="celebration-modal__icon">✓</div>
        <h2 className="celebration-modal__title">Fantastic!</h2>
        <p className="celebration-modal__body">
          You've got the feel for the course and your clubs are warmed up. You finished the hole in 6 shots (Par 3).
        </p>
      </div>
    </Modal>
  )
}

