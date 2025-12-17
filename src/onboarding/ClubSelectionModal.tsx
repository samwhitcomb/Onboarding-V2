import React from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import { useClubBag } from '../context/ClubBagContext'
import { mockClubs, getClubsByType } from '../data'
import './ClubSelectionModal.css'

export const ClubSelectionModal: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const { setSelectedClub } = useClubBag()

  const handleClubSelect = (clubId: string) => {
    const club = mockClubs.find((c) => c.id === clubId)
    if (club) {
      setSelectedClub(club)
      setCurrentStep('five-shot-baseline')
    }
  }

  const renderClubCategory = (type: 'wood' | 'hybrid' | 'iron' | 'wedge', title: string) => {
    const clubs = getClubsByType(type)
    return (
      <div className="club-category">
        <h3 className="club-category__title">{title}</h3>
        <div className="club-category__clubs">
          {clubs.map((club) => (
            <button
              key={club.id}
              className="club-card"
              onClick={() => handleClubSelect(club.id)}
              style={{ '--club-color': club.color } as React.CSSProperties}
            >
              <div className="club-card__badge" style={{ backgroundColor: club.color }}>
                {club.number}
              </div>
              <div className="club-card__info">
                <div className="club-card__brand">{club.brand}</div>
                <div className="club-card__model">{club.model}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Modal fullScreen className="club-selection-modal">
      <div className="club-selection-modal__header">
        <h2 className="club-selection-modal__title">SELECT YOUR CLUB TYPE</h2>
        <button
          className="club-selection-modal__close"
          onClick={() => setCurrentStep('five-shot-baseline')}
        >
          ×
        </button>
      </div>
      <div className="club-selection-modal__content">
        <div className="club-selection-modal__info">
          <p className="club-selection-modal__prompt">
            You're bag is the digital representation of your physical clubs. You can add new clubs, customize clubs, and manage your inventory at any time.
          </p>
        </div>
        <div className="club-selection-modal__info">
          <p className="club-selection-modal__prompt">
            Please{' '}
            <strong>select your club</strong> from the virtual bag.
          </p>
        </div>
        <div className="club-selection-modal__add-section">
          <Button 
            variant="secondary" 
            className="club-selection-modal__add-button"
            onClick={() => {
              // TODO: Open add club dialog/modal
              console.log('Add new club clicked')
            }}
          >
            + Add New Club
          </Button>
        </div>
        <div className="club-selection-modal__categories">
          {renderClubCategory('wood', 'WOODS')}
          {renderClubCategory('hybrid', 'HYBRIDS')}
          {renderClubCategory('iron', 'IRONS')}
          {renderClubCategory('wedge', 'WEDGES')}
        </div>
      </div>
    </Modal>
  )
}

