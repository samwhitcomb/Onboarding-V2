import React from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './ChallengeIntroModal.css'

export const ChallengeIntroModal: React.FC = () => {
  const { setCurrentStep } = useOnboarding()

  return (
    <Modal className="challenge-intro-modal">
      <div className="challenge-intro-modal__content">
        <div className="challenge-intro-modal__icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 4L38.5 17.5L53 19.5L42.5 30L45 45L32 38L19 45L21.5 30L11 19.5L25.5 17.5L32 4Z" 
                  fill="none" stroke="var(--accent-gold)" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M20 52H44V56C44 58.2 42.2 60 40 60H24C21.8 60 20 58.2 20 56V52Z" 
                  fill="none" stroke="var(--accent-gold)" strokeWidth="2.5"/>
            <path d="M26 52V48C26 46 28 44 32 44C36 44 38 46 38 48V52" 
                  fill="none" stroke="var(--accent-gold)" strokeWidth="2.5"/>
            <circle cx="32" cy="26" r="6" fill="var(--accent-gold)" opacity="0.3"/>
          </svg>
        </div>
        
        <p className="challenge-intro-modal__eyebrow">HOLE-IN-ONE Challenge</p>
        <h2 className="challenge-intro-modal__headline">
          Let's Make This Interesting
        </h2>
        
        <p className="challenge-intro-modal__body">
          The iconic 7th hole awaits. To celebrate the start of your journey:
        </p>
        
        <div className="challenge-intro-modal__prize">
          <span className="challenge-intro-modal__prize-label">Hole-in-One Prize</span>
          <span className="challenge-intro-modal__prize-value">1 Year SuperApp Membership</span>
        </div>
        
        <div className="challenge-intro-modal__actions">
          <Button onClick={() => setCurrentStep('personalized-prep')}>
            Accept Challenge
          </Button>
        </div>
      </div>
    </Modal>
  )
}

