import React, { useEffect, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext'
import './LoadingOverlay.css'

export const PracticeLoadingOverlay: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setCurrentStep('tutorial-practice')
          }, 500)
          return 100
        }
        return prev + 2 // 2% per 20ms = 100% in 1 second (20ms * 50 intervals = 1000ms)
      })
    }, 20) // 20ms per 2% = 1 second total

    return () => clearInterval(interval)
  }, [setCurrentStep])

  return (
    <div className="loading-overlay">
      <div className="loading-overlay__gradient"></div>
      <div className="loading-overlay__title-container">
        <h2 className="loading-overlay__title">LOADING PRACTICE</h2>
        <p className="loading-overlay__description">
          Preparing practice mode...
        </p>
      </div>
      <div className="loading-overlay__progress-container">
        <div className="loading-overlay__progress">
          <div className="loading-overlay__progress-bar">
            <div
              className="loading-overlay__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="loading-overlay__progress-text">loading {Math.floor(progress)}%</div>
        </div>
      </div>
    </div>
  )
}

