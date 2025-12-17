import React, { useState } from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import { useShotData } from '../context/ShotDataContext'
import { useClubBag } from '../context/ClubBagContext'
import './DataSavingModal.css'

export const DataSavingModal: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const { getAverageData } = useShotData()
  const { selectedClub, mapClub } = useClubBag()
  const [clubName, setClubName] = useState(selectedClub?.name || '')

  const handleSave = () => {
    if (selectedClub) {
      const averageData = getAverageData()
      mapClub(selectedClub, {
        averageCarry: averageData?.carry || 0,
        averageTotal: averageData?.total || 0,
        averageBallSpeed: averageData?.ballSpeed || 0,
      })
      setCurrentStep('baseline-complete')
    }
  }

  return (
    <Modal>
      <div className="data-saving-modal">
        <h2 className="data-saving-modal__title">Save Your Data</h2>
        <p className="data-saving-modal__body">
          Would you like to save this data as your official{' '}
          <strong>{selectedClub?.name || 'Club'} Gapping Data</strong>?
        </p>
        <div className="data-saving-modal__input">
          <label htmlFor="club-name">Club Name:</label>
          <input
            id="club-name"
            type="text"
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            placeholder={selectedClub?.name || 'Club Name'}
          />
        </div>
        <div className="data-saving-modal__actions">
          <Button onClick={handleSave}>Yes, Save to Bag</Button>
          <Button variant="secondary" onClick={() => setCurrentStep('baseline-complete')}>
            No, Discard
          </Button>
        </div>
      </div>
    </Modal>
  )
}

