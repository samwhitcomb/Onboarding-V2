import React from 'react'
import courseplayImage from '../assets/images/Courseplay.png'
import './Background.css'

export const CourseplayBackground: React.FC = () => {
  return (
    <div className="background background--courseplay">
      <img src={courseplayImage} alt="Courseplay" className="background__image" />
    </div>
  )
}

