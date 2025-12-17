import React from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './BaselineCompleteModal.css'

export const BaselineCompleteModal: React.FC = () => {
  const { setCurrentStep } = useOnboarding()

  const handleContinue = () => {
    setCurrentStep('loading')
  }

  const handleExit = () => {
    setCurrentStep('welcome')
  }

  return (
    <Modal className="baseline-complete-modal">
      <button className="baseline-complete-modal__exit" onClick={handleExit} aria-label="Exit">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <div className="baseline-complete-modal__content">
        <div className="baseline-complete-modal__checkmark">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" stroke="var(--accent-green)" strokeWidth="3" fill="none"/>
            <path d="M20 32L28 40L44 24" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="baseline-complete-modal__flight-complete">
          <span className="baseline-complete-modal__flight-label">Flight Plan Complete</span>
          <h2 className="baseline-complete-modal__flight-title">Build Your 5-Shot Baseline</h2>
        </div>

        <div className="baseline-complete-modal__divider"></div>

        <div className="baseline-complete-modal__next-flight">
          <span className="baseline-complete-modal__next-label">Next Flight Plan</span>
          <h3 className="baseline-complete-modal__next-title">Morning at Pebble Beach</h3>
          <p className="baseline-complete-modal__next-subtitle">The Hero Shot</p>
        </div>

        <p className="baseline-complete-modal__segue">
          Your baseline is locked in. Now it's time to put your data to the test on one of the world's most iconic holes.
        </p>

        <p className="baseline-complete-modal__awaits">Pebble Beach awaits.</p>

        <div className="baseline-complete-modal__actions">
          <Button variant="primary" onClick={handleContinue}>
            Continue to Pebble Beach
          </Button>
        </div>
      </div>
    </Modal>
  )
}

