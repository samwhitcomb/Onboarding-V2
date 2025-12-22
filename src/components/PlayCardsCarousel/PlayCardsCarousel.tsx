import React from 'react'
import { PlayCard } from '../PlayCard/PlayCard'
import { useOnboarding, OnboardingStep } from '../../context/OnboardingContext'
import './PlayCardsCarousel.css'

// Import images
import PracticeImg from '../../assets/images/PlayCards/Practice.png'
import RangeImg from '../../assets/images/PlayCards/Range.png'
import TargetRangeImg from '../../assets/images/PlayCards/TargetRange.png'
import CoursesImg from '../../assets/images/PlayCards/Courses.png'
import CTPImg from '../../assets/images/PlayCards/CTP.png'

interface PlayCardData {
  id: string
  title: string
  description: string
  imagePath: string
}

const playCards: PlayCardData[] = [
  {
    id: 'practice',
    title: 'Practice',
    description: 'Hone your skills with unlimited shots and instant feedback',
    imagePath: PracticeImg,
  },
  {
    id: 'range',
    title: 'Range',
    description: 'Experience realistic driving range with advanced ball tracking',
    imagePath: RangeImg,
  },
  {
    id: 'target-range',
    title: 'Target Range',
    description: 'Test your accuracy with precision target challenges',
    imagePath: TargetRangeImg,
  },
  {
    id: 'courses',
    title: 'Courses',
    description: 'Play world-famous golf courses from the comfort of home',
    imagePath: CoursesImg,
  },
  {
    id: 'ctp',
    title: 'Closest to the Pin',
    description: 'Compete for the closest shot to the pin in this classic challenge',
    imagePath: CTPImg,
  },
]

export const PlayCardsCarousel: React.FC = () => {
  const { setCurrentStep } = useOnboarding()

  const handleCardClick = (cardId: string) => {
    // Check if user has seen tutorial for this mode
    const tutorialKey = `tutorial-${cardId}`
    const hasSeenTutorial = localStorage.getItem(tutorialKey) === 'true'

    if (!hasSeenTutorial) {
      // Navigate to loading screen first, then tutorial will show after loading
      const loadingStepMap: Record<string, OnboardingStep> = {
        'practice': 'practice-loading',
        'range': 'range-loading',
        'target-range': 'target-range-loading',
        'ctp': 'ctp-loading',
        'courses': 'course-loading',
      }
      const loadingStep = loadingStepMap[cardId]
      if (loadingStep) {
        setCurrentStep(loadingStep)
      }
    } else {
      // For other modes, stay on launcher for now
      // In a real app, this would navigate to the actual game mode
    }
  }

  return (
    <div className="play-cards-carousel">
      <div className="play-cards-carousel__container">
        <div className="play-cards-carousel__content">
          {playCards.map((card) => (
            <div key={card.id} className="play-cards-carousel__item">
              <PlayCard
                title={card.title}
                description={card.description}
                imagePath={card.imagePath}
                onClick={() => handleCardClick(card.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

