import React, { useState, useEffect } from 'react'
import { StudioBadge } from '../StudioBadge/StudioBadge'
import './CourseCard.css'

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
  continent?: string
  batch?: string
  architect?: string
  blurb?: string[]
  userRating?: number
}

interface CourseCardProps {
  course: Course
  onClick: () => void
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [triedExtensions, setTriedExtensions] = useState<Set<string>>(new Set())

  const getImagePath = (): string => {
    // If course.imageUrl is already set (from CourseSelectionPage), use it directly
    // It should already have the correct base path
    if (course.imageUrl) {
      return course.imageUrl
    }
    // Fallback: construct image path from course id
    const imageName = course.id || course.name.toLowerCase().replace(/\s+/g, '-')
    // Use public folder path - account for Vite base path
    const basePath = import.meta.env.BASE_URL || '/'
    // Try jpg first (most common)
    return `${basePath}courses/${imageName}_hero.jpg`
  }

  const [currentImagePath, setCurrentImagePath] = useState(getImagePath())
  
  // Initialize tried extensions with the first extension we're trying
  useEffect(() => {
    const initialExt = currentImagePath.split('.').pop()?.toLowerCase() || 'jpg'
    setTriedExtensions(new Set([initialExt]))
  }, []) // Only run once on mount

  // Try different extensions if image fails to load
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imageName = course.id || course.name.toLowerCase().replace(/\s+/g, '-')
    const extensions = ['jpg', 'webp', 'jpeg', 'png']
    const currentPath = currentImagePath
    const currentExt = currentPath.split('.').pop()?.toLowerCase() || 'jpg'
    
    // Mark this extension as tried
    const newTried = new Set(triedExtensions)
    newTried.add(currentExt)
    setTriedExtensions(newTried)
    
    // Find next untried extension
    const nextExt = extensions.find(ext => !newTried.has(ext))
    
    if (nextExt) {
      // Try next extension
      const basePath = import.meta.env.BASE_URL || '/'
      const nextPath = `${basePath}courses/${imageName}_hero.${nextExt}`
      setCurrentImagePath(nextPath)
      setImageError(false) // Reset error to allow retry
      setImageLoading(true) // Reset loading state
    } else {
      // Tried all extensions, show placeholder
      setImageError(true)
      // Hide the broken image
      const target = e.target as HTMLImageElement
      if (target) {
        target.style.display = 'none'
      }
    }
  }

  const getCountryFlag = (location: string): string => {
    const locationLower = location.toLowerCase()

    if (locationLower.includes('scotland') || locationLower.includes('england') || 
        locationLower.includes('northern ireland') || locationLower.includes('uk')) {
      return '🇬🇧'
    }
    if (locationLower.includes('australia') || locationLower.includes('tasmania')) {
      return '🇦🇺'
    }
    if (locationLower.includes('new zealand')) {
      return '🇳🇿'
    }
    if (locationLower.includes('japan') || locationLower.includes('kobe') || 
        locationLower.includes('osaka') || locationLower.includes('saitama')) {
      return '🇯🇵'
    }
    if (locationLower.includes('south korea') || locationLower.includes('jeju')) {
      return '🇰🇷'
    }
    if (locationLower.includes('china') || locationLower.includes('shenzhen')) {
      return '🇨🇳'
    }
    if (locationLower.includes('thailand') || locationLower.includes('pattaya') || 
        locationLower.includes('pathum thani')) {
      return '🇹🇭'
    }
    if (locationLower.includes('spain') || locationLower.includes('sotogrande') || 
        locationLower.includes('casares')) {
      return '🇪🇸'
    }
    if (locationLower.includes('portugal') || locationLower.includes('cascais') || 
        locationLower.includes('óbidos')) {
      return '🇵🇹'
    }
    if (locationLower.includes('france') || locationLower.includes('paris') || 
        locationLower.includes('chantilly') || locationLower.includes('mortefontaine')) {
      return '🇫🇷'
    }
    if (locationLower.includes('south africa') || locationLower.includes('george') || 
        locationLower.includes('kleinmond') || locationLower.includes('mpumalanga') || 
        locationLower.includes('sun city')) {
      return '🇿🇦'
    }
    if (locationLower.includes('canada') || locationLower.includes('toronto') || 
        locationLower.includes('ancaster') || locationLower.includes('nova scotia') || 
        locationLower.includes('inverness')) {
      return '🇨🇦'
    }
    if (locationLower.includes('mexico') || locationLower.includes('playa del carmen')) {
      return '🇲🇽'
    }
    if (locationLower.includes('dominican') || locationLower.includes('punta cana') || 
        locationLower.includes('cap cana') || locationLower.includes('la romana')) {
      return '🇩🇴'
    }
    return '🇺🇸'
  }

  return (
    <div
      className={`course-card-browse ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="course-card-image-container">
        {course.isStudio && (
          <div className="course-card-studio-badge">
            <StudioBadge variant="card" size="small" />
          </div>
        )}
        {course.hasImage && !imageError ? (
          <img
            src={currentImagePath}
            alt={course.name}
            className="course-card-image"
            onError={handleImageError}
            onLoad={() => setImageLoading(false)}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        ) : imageError ? (
          <div className="course-card-placeholder">
            <span>No Image</span>
          </div>
        ) : null}
        {isHovered && (
          <div className="course-card-overlay">
            <div className="course-card-stats">
              {course.type && (
                <div className="stat-item">
                  <span className="stat-label">Type</span>
                  <span className="stat-value">{course.type}</span>
                </div>
              )}
              <div className="stat-item">
                <span className="stat-label">Quality</span>
                {course.isStudio ? (
                  <span className="stat-value studio-premium studio-shimmer-text">LIDAR SCANNED</span>
                ) : (
                  <span className="stat-value">Satellite</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="course-card-info">
        <div className="course-card-header">
          <span className="course-card-flag">{getCountryFlag(course.location)}</span>
          <div className="course-card-rating">
            {course.yardage && (
              <span className="course-yardage">{course.yardage.toLocaleString()} yds</span>
            )}
            <span className="rating-stars">★★★★★</span>
            <span className="rating-value">{course.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="course-card-name">{course.name}</h3>
        {course.isStudio && course.hasStandardVersion && (
          <p className="course-card-standard-indicator">Also available in Standard</p>
        )}
        <p className="course-card-location">{course.location}</p>
      </div>
    </div>
  )
}

