import React, { useState } from 'react'
import { Modal, Button } from '../components'
import './TutorialCourses.css'

type Phase = 'intro' | 'features' | 'choose-course' | 'complete'

export const TutorialCourses: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('intro')

  const handleSkip = () => {
    localStorage.setItem('tutorial-courses', 'true')
    // Move to choose-course phase to show guidance
    setPhase('choose-course')
    window.dispatchEvent(new CustomEvent('tutorial-courses-choose-phase'))
  }

  const handleNext = () => {
    if (phase === 'intro') {
      setPhase('features')
    } else if (phase === 'features') {
      setPhase('choose-course')
      window.dispatchEvent(new CustomEvent('tutorial-courses-choose-phase'))
    } else if (phase === 'choose-course') {
      handleComplete()
    }
  }

  const handleComplete = () => {
    localStorage.setItem('tutorial-courses', 'true')
    // Stay on course selection page - tutorial is shown from within the page
    // The parent component will handle hiding the tutorial
    window.dispatchEvent(new CustomEvent('tutorial-courses-dismissed'))
  }

  return (
    <Modal className="tutorial-courses">
      <div className="tutorial-courses__content">
        {phase === 'intro' && (
          <>
            <h2 className="tutorial-courses__title">Welcome to Course Selection</h2>
            <p className="tutorial-courses__description">
              Browse and play world-famous golf courses from the comfort of home. Our course library features 
              iconic venues with realistic course conditions, detailed scoring, and immersive gameplay.
            </p>
            <div className="tutorial-courses__features">
              <div className="tutorial-courses__feature">
                <strong>Extensive Course Library:</strong> Choose from hundreds of world-class courses including Pebble Beach, St. Andrews, Augusta National, and more.
              </div>
              <div className="tutorial-courses__feature">
                <strong>Smart Search & Filters:</strong> Find your perfect course by location, difficulty, architect, or mood.
              </div>
              <div className="tutorial-courses__feature">
                <strong>Studio & Standard Versions:</strong> Experience courses in ultra-realistic Studio mode or standard satellite versions.
              </div>
            </div>
          </>
        )}

        {phase === 'features' && (
          <>
            <h2 className="tutorial-courses__title">Course Selection Features</h2>
            <div className="tutorial-courses__tips">
              <div className="tutorial-courses__tip">
                <h3>Browse & Search</h3>
                <p>Use the search bar to find specific courses, or browse curated collections and smart lists organized by your preferences.</p>
              </div>
              <div className="tutorial-courses__tip">
                <h3>Filter Options</h3>
                <p>Filter courses by continent, type (links, parkland, etc.), difficulty, and content tier to find exactly what you're looking for.</p>
              </div>
              <div className="tutorial-courses__tip">
                <h3>Course Details</h3>
                <p>View detailed information about each course including ratings, yardage, architect, and course descriptions before you play.</p>
              </div>
            </div>
          </>
        )}

        {phase === 'choose-course' && (
          <>
            <h2 className="tutorial-courses__title">Choose a Course</h2>
            <p className="tutorial-courses__description">
              Now it's time to select a course and set up your game. Click on any course card below to view details, then press "Tee Off" to begin playing.
            </p>
            <div className="tutorial-courses__features">
              <div className="tutorial-courses__feature">
                <strong>Browse Courses:</strong> Scroll through the course carousels to see all available options. Each course card shows the name, location, and rating.
              </div>
              <div className="tutorial-courses__feature">
                <strong>View Details:</strong> Click on any course to see full information including scorecard, map, and course statistics.
              </div>
              <div className="tutorial-courses__feature">
                <strong>Start Playing:</strong> Once you've selected a course, click "Tee Off" to begin your round and start the game setup.
              </div>
            </div>
          </>
        )}

        <div className="tutorial-courses__actions">
          {phase !== 'choose-course' && (
            <Button variant="ghost" onClick={handleSkip}>
              Skip Tutorial
            </Button>
          )}
          <Button variant="primary" onClick={handleNext}>
            {phase === 'choose-course' ? 'Got It' : phase === 'features' ? 'Next' : 'Next'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

