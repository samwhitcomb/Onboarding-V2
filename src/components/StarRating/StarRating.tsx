import React, { useState } from 'react'
import './StarRating.css'

interface StarRatingProps {
  value?: number
  onChange?: (rating: number) => void
  readOnly?: boolean
}

export const StarRating: React.FC<StarRatingProps> = ({ value = 0, onChange, readOnly = false }) => {
  const [hoverValue, setHoverValue] = useState(0)

  const handleStarClick = (rating: number) => {
    if (!readOnly && onChange) {
      onChange(rating)
    }
  }

  const handleStarHover = (rating: number) => {
    if (!readOnly) {
      setHoverValue(rating)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0)
    }
  }

  const displayValue = hoverValue || value

  return (
    <div 
      className={`star-rating ${readOnly ? 'read-only' : ''}`}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= displayValue ? 'filled' : 'empty'}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          disabled={readOnly}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}


