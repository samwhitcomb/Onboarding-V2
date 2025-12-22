import React, { useEffect, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext'
import './LoadingOverlay.css'

interface CoursePlayLoadingOverlayProps {
  courseName?: string
  courseLocation?: string
}

export const CoursePlayLoadingOverlay: React.FC<CoursePlayLoadingOverlayProps> = ({ 
  courseName = 'Pebble Beach Golf Links',
  courseLocation = 'Monterey County, CALIFORNIA'
}) => {
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
        return prev + 0.5 // 0.5% per 50ms = 10 seconds total (50ms * 200 intervals = 10,000ms)
      })
    }, 50) // 50ms per 0.5% = 10 seconds total

    return () => clearInterval(interval)
  }, [setCurrentStep])

  // Generate a description based on course name or use default
  const getDescription = () => {
    if (courseName.toLowerCase().includes('pebble')) {
      return 'The Pacific breeze is light and the sunlight cuts through the retreating ocean haze. The dew is still on the greens—a perfect canvas for today\'s challenge.'
    }
    return 'Preparing the course for your round. The conditions are perfect and everything is set for an unforgettable experience.'
  }

  return (
    <div className="loading-overlay">
      <div className="loading-overlay__gradient"></div>
      <div className="loading-overlay__title-container">
        <h2 className="loading-overlay__title">{courseName.toUpperCase()}, {courseLocation.toUpperCase()}</h2>
        <p className="loading-overlay__description">
          {getDescription()}
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


