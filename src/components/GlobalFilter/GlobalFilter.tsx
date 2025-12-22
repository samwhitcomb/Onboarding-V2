import React from 'react'
import './GlobalFilter.css'

export type FilterType = 'all' | 'simulator' | 'live'

interface GlobalFilterProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export const GlobalFilter: React.FC<GlobalFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="global-filter">
      <button
        className={`global-filter__button ${
          activeFilter === 'all' ? 'global-filter__button--active' : ''
        }`}
        onClick={() => onFilterChange('all')}
      >
        All Sessions
      </button>
      <button
        className={`global-filter__button ${
          activeFilter === 'simulator' ? 'global-filter__button--active' : ''
        }`}
        onClick={() => onFilterChange('simulator')}
      >
        🏠 Simulator
      </button>
      <button
        className={`global-filter__button ${
          activeFilter === 'live' ? 'global-filter__button--active' : ''
        }`}
        onClick={() => onFilterChange('live')}
      >
        ⛳ Live Play
      </button>
    </div>
  )
}


