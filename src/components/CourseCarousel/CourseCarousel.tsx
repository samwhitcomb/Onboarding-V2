import React, { useRef, useState } from 'react'
import { CourseCard } from '../CourseCard/CourseCard'
import './CourseCarousel.css'

interface Course {
  id: string
  name: string
  description?: string
  location: string
  rating: number
  type?: string
  yardage?: number
  isStudio?: boolean
  hasStandardVersion?: boolean
  imageUrl?: string
  hasImage?: boolean
}

interface CourseCarouselProps {
  title: string
  description?: string
  courses: (Course | { type: 'divider'; label: string })[]
  onCourseClick: (course: Course) => void
}

export const CourseCarousel: React.FC<CourseCarouselProps> = ({ 
  title, 
  description, 
  courses, 
  onCourseClick 
}) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  const scroll = (direction: 'left' | 'right') => {
    const container = carouselRef.current
    if (!container) return
    
    const scrollAmount = 400
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  if (!courses || courses.length === 0) {
    return null
  }

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <div className="carousel-title-section">
          <h2 
            className="carousel-title"
            onMouseEnter={() => description && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {title}
            {description && showTooltip && (
              <div className="carousel-tooltip">
                <div className="tooltip-arrow"></div>
                <p className="tooltip-text">{description}</p>
              </div>
            )}
          </h2>
        </div>
        <div className="carousel-controls">
          <button 
            className="carousel-arrow carousel-arrow-left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button 
            className="carousel-arrow carousel-arrow-right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>
      <div className="carousel-container" ref={carouselRef}>
        <div className="carousel-track">
          {courses.map((item, index) => {
            if ('type' in item && item.type === 'divider') {
              return (
                <div key={`divider-${index}`} className="carousel-divider">
                  <div className="carousel-divider-line"></div>
                  <span className="carousel-divider-label">{item.label}</span>
                  <div className="carousel-divider-line"></div>
                </div>
              )
            }
            const course = item as Course
            return (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => onCourseClick(course)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}


