import React, { useState } from 'react'
import './PlayCard.css'

interface PlayCardProps {
  title: string
  description: string
  imagePath: string
  onClick?: () => void
}

export const PlayCard: React.FC<PlayCardProps> = ({
  title,
  description,
  imagePath,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`play-card ${isHovered ? 'play-card--hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <img
        src={imagePath}
        alt={title}
        className="play-card__image"
      />
      <div className="play-card__overlay" />
      <div className="play-card__content">
        <h3 className="play-card__title">{title}</h3>
        <p className={`play-card__description ${isHovered ? 'play-card__description--visible' : ''}`}>
          {description}
        </p>
      </div>
    </div>
  )
}


