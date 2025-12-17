import React from 'react'
import puttingImage from '../assets/images/Putting pebble.png'
import './Background.css'

export const PuttingBackground: React.FC = () => {
  return (
    <div className="background background--putting">
      <img src={puttingImage} alt="Putting" className="background__image" />
    </div>
  )
}
