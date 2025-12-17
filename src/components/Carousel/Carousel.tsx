import React, { useState, useRef, useEffect } from 'react'
import './Carousel.css'

interface CarouselProps {
  children: React.ReactNode[]
  className?: string
  showArrows?: boolean
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  className = '',
  showArrows = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = container.offsetWidth / 4 // Show 4 cards at a time
      container.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      })
      setCurrentIndex(index)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < children.length - 4) {
      scrollToIndex(currentIndex + 1)
    }
  }

  return (
    <div className={`carousel ${className}`}>
      {showArrows && (
        <button
          className="carousel__arrow carousel__arrow--prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ‹
        </button>
      )}
      <div className="carousel__container" ref={scrollContainerRef}>
        <div className="carousel__content">
          {children.map((child, index) => (
            <div key={index} className="carousel__item">
              {child}
            </div>
          ))}
        </div>
      </div>
      {showArrows && (
        <button
          className="carousel__arrow carousel__arrow--next"
          onClick={handleNext}
          disabled={currentIndex >= children.length - 4}
        >
          ›
        </button>
      )}
    </div>
  )
}

