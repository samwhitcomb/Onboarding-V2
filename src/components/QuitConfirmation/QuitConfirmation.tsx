import React from 'react'
import { createPortal } from 'react-dom'
import { Modal } from '../Modal/Modal'
import { Button } from '../Button/Button'
import './QuitConfirmation.css'

interface QuitConfirmationProps {
  onConfirm: () => void
  onCancel: () => void
  sectionName?: string
}

export const QuitConfirmation: React.FC<QuitConfirmationProps> = ({ onConfirm, onCancel, sectionName = 'Session' }) => {
  if (typeof document === 'undefined') return null

  return createPortal(
    <Modal onClose={onCancel} className="quit-confirmation-modal">
      <div className="quit-confirmation">
        <h2 className="quit-confirmation__title">Pause {sectionName}?</h2>
        <p className="quit-confirmation__body">
          Your progress is automatically saved. You can continue where you left off.
        </p>
        <div className="quit-confirmation__actions">
          <Button variant="secondary" onClick={onCancel}>
            Keep Going
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Exit for Now
          </Button>
        </div>
      </div>
    </Modal>,
    document.body,
  )
}

