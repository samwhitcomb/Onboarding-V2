import React, { useEffect, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext'
import './LoadingOverlay.css'

export const LoadingOverlay: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setCurrentStep('courseplay-warmup')
          }, 500)
          return 100
        }
        return prev + 0.25
      })
    }, 50) // 50ms per 0.25% = 20 seconds total (50ms * 400 intervals = 20,000ms)

    return () => clearInterval(interval)
  }, [setCurrentStep])

  return (
    <div className="loading-overlay">
      <div className="loading-overlay__gradient"></div>
      <div className="loading-overlay__title-container">
        <h2 className="loading-overlay__title">PEBBLE BEACH, Monterey County, CALIFORNIA</h2>
        <p className="loading-overlay__description">
        The Pacific breeze is light and the sunlight cuts through the retreating ocean haze. The dew is still on the greens—a perfect canvas for today's challenge.
        </p>
      </div>
      <div className="loading-overlay__weather">
        <div className="weather-widget">
          <div className="weather-widget__icon">☀️</div>
          <div className="weather-widget__details">
            <div className="weather-widget__temp">68°F</div>
            <div className="weather-widget__wind">Wind: 8 mph NE</div>
          </div>
        </div>
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

