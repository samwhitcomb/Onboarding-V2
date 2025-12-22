import React from 'react'
import sessionsImage from '../assets/images/Sessions.png'
import './Background.css'

export const ProfileBackground: React.FC = () => {
  return (
    <div className="background background--profile">
      <img src={sessionsImage} alt="Profile" className="background__image" />
    </div>
  )
}


