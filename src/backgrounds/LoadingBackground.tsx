import React from 'react'
import loadingImage from '../assets/images/Pebble Beach Loading.png'
import './Background.css'

export const LoadingBackground: React.FC = () => {
  return (
    <div className="background background--loading">
      <img src={loadingImage} alt="Pebble Beach Loading" className="background__image" />
    </div>
  )
}

