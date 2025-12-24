import React, { useEffect, useState } from 'react'
import { Modal, Button } from '../components'
import { FlightPlansCarousel } from '../components/FlightPlansCarousel/FlightPlansCarousel'
import { useOnboarding } from '../context/OnboardingContext'
import './FlightPlansIntro.css'

export const FlightPlansIntro: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const [showCarousel, setShowCarousel] = useState(false)

  useEffect(() => {
    // Show carousel after modal appears
    const timer = setTimeout(() => {
      setShowCarousel(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    setCurrentStep('settings-check')
  }

  return (
    <>
      <Modal className="flight-plans-intro-modal">
        <div className="flight-plans-intro-modal__content">
          <h2 className="flight-plans-intro-modal__title">Introducing Flight Plans</h2>
          <div className="flight-plans-intro-modal__body">
            <p>
              The Rapsodo Golf Suite contains dozens of powerful modes and features designed to refine your
              swing and lower your scores. To help you master these, we've created some short guided pathways called <strong>'Flight Plans.'</strong>
            </p>
            <p>
              These guided experiences will help you build your data foundation, and understanding of the software.
            </p>
          </div>
          <div className="flight-plans-intro-modal__actions">
            <Button variant="primary" onClick={handleContinue}>
              Continue
            </Button>
          </div>
        </div>
      </Modal>
      {showCarousel && (
        <div className="flight-plans-intro-carousel">
          <FlightPlansCarousel />
        </div>
      )}
    </>
  )
}

