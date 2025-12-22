import React from 'react'
import sessionsImage from '../assets/images/Sessions.png'
import './Background.css'

export const SessionsBackground: React.FC = () => {
  return (
    <div className="background background--sessions">
      <img src={sessionsImage} alt="Sessions" className="background__image" />
    </div>
  )
}

