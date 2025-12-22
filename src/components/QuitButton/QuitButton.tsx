import React from 'react'
import './QuitButton.css'

interface QuitButtonProps {
  onQuit?: () => void
  sectionName?: string
}

export const QuitButton: React.FC<QuitButtonProps> = ({ onQuit, sectionName = 'session' }) => {
  const handleClick = () => {
    if (onQuit) {
      onQuit()
    }
  }

  return (
    <div className="quit-layer" aria-live="polite">
      <button className="quit-button" onClick={handleClick} aria-label={`Quit ${sectionName}`}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}


