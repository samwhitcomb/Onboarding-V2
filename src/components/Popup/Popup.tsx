import React from 'react'
import './Popup.css'

interface PopupProps {
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'custom'
  customPosition?: { top?: string; left?: string; right?: string; bottom?: string }
  arrow?: 'top' | 'bottom' | 'left' | 'right' | 'none'
  className?: string
  highlight?: boolean
}

export const Popup: React.FC<PopupProps> = ({
  children,
  position = 'center',
  customPosition,
  arrow = 'none',
  className = '',
  highlight = false,
}) => {
  const style: React.CSSProperties = customPosition || {}

  return (
    <div
      className={`popup popup--${position} ${highlight ? 'popup--highlight' : ''} ${className}`}
      style={style}
    >
      {arrow !== 'none' && <div className={`popup__arrow popup__arrow--${arrow}`} />}
      <div className="popup__content">{children}</div>
    </div>
  )
}

