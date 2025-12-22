import React from 'react'
import './CarouselSwitcher.css'

interface CarouselSwitcherProps {
  activeTab: 'smart' | 'curated'
  onTabChange: (tab: 'smart' | 'curated') => void
}

export const CarouselSwitcher: React.FC<CarouselSwitcherProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="carousel-switcher">
      <button
        className={`switcher-tab ${activeTab === 'smart' ? 'active' : ''}`}
        onClick={() => onTabChange('smart')}
      >
        Smart List
      </button>
      <button
        className={`switcher-tab ${activeTab === 'curated' ? 'active' : ''}`}
        onClick={() => onTabChange('curated')}
      >
        Categories
      </button>
    </div>
  )
}


