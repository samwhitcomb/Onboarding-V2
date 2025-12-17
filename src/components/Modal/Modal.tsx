import React, { useEffect } from 'react'
import './Modal.css'

interface ModalProps {
  children: React.ReactNode
  onClose?: () => void
  showCloseButton?: boolean
  className?: string
  fullScreen?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
  showCloseButton = false,
  className = '',
  fullScreen = false,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal ${fullScreen ? 'modal--fullscreen' : ''} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && onClose && (
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  )
}

