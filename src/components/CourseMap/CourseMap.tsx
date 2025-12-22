import React from 'react'
import './CourseMap.css'

interface CourseMapProps {
  course: any
}

export const CourseMap: React.FC<CourseMapProps> = ({ course }) => {
  // Get course coordinates
  const latitude = course.latitude
  const longitude = course.longitude
  
  if (!latitude || !longitude) {
    return (
      <div className="course-map-error">
        <p>Course location data not available</p>
      </div>
    )
  }

  // For now, show a placeholder map - in a real app, this would use Leaflet or Google Maps
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=17`

  return (
    <div className="course-map-container">
      <div className="course-map-info">
        <h3 className="map-course-name">{course.name}</h3>
        <div className="map-course-details">
          {course.yardage && <span>{course.yardage.toLocaleString()} yds</span>}
          {course.par && <span>Par {course.par}</span>}
          <span>18 Holes</span>
          {course.type && <span className="course-type-badge">{course.type}</span>}
        </div>
        <p className="map-course-location">{course.location}</p>
      </div>
      
      <div className="course-map-placeholder">
        <iframe
          width="100%"
          height="600"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6F4b9b3J6kQ&q=${latitude},${longitude}&zoom=17`}
        />
      </div>
    </div>
  )
}


