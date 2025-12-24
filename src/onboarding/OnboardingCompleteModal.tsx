import React from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import './OnboardingCompleteModal.css'

export const OnboardingCompleteModal: React.FC = () => {
  const { setCurrentStep } = useOnboarding()

  const handleExplore = () => {
    setCurrentStep('complete')
  }

  return (
    <Modal className="onboarding-complete-modal">
      <div className="onboarding-complete-modal__content">
        <div className="onboarding-complete-modal__icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" stroke="var(--accent-green)" strokeWidth="2.5" fill="none"/>
            <path d="M20 32L28 40L44 24" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p className="onboarding-complete-modal__eyebrow">Onboarding Complete</p>
        <h2 className="onboarding-complete-modal__title">You're All Set!</h2>
        
        <p className="onboarding-complete-modal__message">
          You've completed the quick start guide and experienced some core features 
          and navigation within the Rapsodo Golf Suite. Your baseline data is saved and ready to help you improve.
        </p>

        <div className="onboarding-complete-modal__next-steps">
          <h3 className="onboarding-complete-modal__next-title">What's Next?</h3>
          <ul className="onboarding-complete-modal__list">
            <li>
              <span className="onboarding-complete-modal__list-icon">📋</span>
              <span><strong>Flight Plans</strong> — More guided experiences await. Complete them at your own pace.</span>
            </li>
            <li>
              <span className="onboarding-complete-modal__list-icon">🎯</span>
              <span><strong>Practice Range</strong> — Build your bag data and perfect your distances.</span>
            </li>
            <li>
              <span className="onboarding-complete-modal__list-icon">⛳</span>
              <span><strong>Course Play</strong> — Take on world-famous courses with your personalized data.</span>
            </li>
          </ul>
        </div>

        <p className="onboarding-complete-modal__freedom">
          Feel free to explore the app at your leisure. Your Flight Plans will always 
          be available when you're ready for more guided content.
        </p>

        <div className="onboarding-complete-modal__actions">
          <Button onClick={handleExplore}>Start Exploring</Button>
        </div>
      </div>
    </Modal>
  )
}

