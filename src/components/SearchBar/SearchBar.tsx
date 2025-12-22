import React from 'react'
import './SearchBar.css'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  value?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search courses...", 
  value = "" 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    onSearch(query)
  }

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      <span className="search-icon">🔍</span>
    </div>
  )
}


