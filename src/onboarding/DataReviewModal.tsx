import React from 'react'
import { Modal, Button } from '../components'
import { useOnboarding } from '../context/OnboardingContext'
import { useShotData } from '../context/ShotDataContext'
import { useUserPreferences } from '../context/UserPreferencesContext'
import './DataReviewModal.css'

export const DataReviewModal: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const { shots, getAverageData } = useShotData()
  const { distanceUnit, speedUnit } = useUserPreferences()
  const averageData = getAverageData()

  const unitLabel = distanceUnit.toUpperCase()
  const speedLabel = speedUnit.toUpperCase()

  if (!averageData) {
    return null
  }

  return (
    <Modal className="data-review-modal">
      <div className="data-review-modal__content">
        <h2 className="data-review-modal__title">Congratulations!</h2>
        <p className="data-review-modal__body">
          You completed your first session. This is your average data, built from{' '}
          <strong>5 individual shots</strong>. Our system captures and records{' '}
          <strong>everything</strong>—ensuring your improvement is always based on reliable data.
        </p>
        <div className="data-review-modal__table">
          <div className="data-row">
            <span className="data-row__label">Ball Speed</span>
            <span className="data-row__value">
              {averageData.ballSpeed?.toFixed(1)} {speedLabel}
            </span>
          </div>
          <div className="data-row">
            <span className="data-row__label">Launch Angle</span>
            <span className="data-row__value">{averageData.launchAngle?.toFixed(1)}°</span>
          </div>
          <div className="data-row">
            <span className="data-row__label">Spin Rate</span>
            <span className="data-row__value">
              {averageData.spinRate?.toFixed(0)} {speedLabel}
            </span>
          </div>
          <div className="data-row">
            <span className="data-row__label">Carry</span>
            <span className="data-row__value">
              {averageData.carry?.toFixed(0)} {unitLabel}
            </span>
          </div>
          <div className="data-row">
            <span className="data-row__label">Total</span>
            <span className="data-row__value">
              {averageData.total?.toFixed(0)} {unitLabel}
            </span>
          </div>
          <div className="data-row">
            <span className="data-row__label">Club Speed</span>
            <span className="data-row__value">
              {averageData.clubSpeed?.toFixed(1)} {speedLabel}
            </span>
          </div>
        </div>
        <div className="data-review-modal__actions">
          <Button onClick={() => setCurrentStep('data-saving')}>Save Data</Button>
          <Button variant="secondary" onClick={() => setCurrentStep('loading')}>
            Discard
          </Button>
        </div>
      </div>
    </Modal>
  )
}

