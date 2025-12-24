import React from 'react'
import { createPortal } from 'react-dom'
import { Modal } from '../Modal/Modal'
import { Button } from '../Button/Button'
import './DeleteConfirmation.css'

interface DeleteConfirmationProps {
  onConfirm: () => void
  onCancel: () => void
  message?: string
  title?: string
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onConfirm,
  onCancel,
  message = 'Are you sure you want to delete this session?',
  title = 'Delete Session',
}) => {
  if (typeof document === 'undefined') return null

  return createPortal(
    <Modal onClose={onCancel} className="delete-confirmation-modal">
      <div className="delete-confirmation">
        <h2 className="delete-confirmation__title">{title}</h2>
        <p className="delete-confirmation__body">{message}</p>
        <div className="delete-confirmation__actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>,
    document.body,
  )
}

