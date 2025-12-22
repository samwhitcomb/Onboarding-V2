import React, { useState } from 'react'
import './ClubCircles.css'

interface ClubCirclesProps {
  clubs: string[]
}

// Helper function to get club abbreviation (e.g., "Driver" -> "Dr", "7 Iron" -> "7i", "Pitching Wedge" -> "PW")
const getClubAbbreviation = (club: string): string => {
  const lower = club.toLowerCase()
  
  // Driver
  if (lower.includes('driver')) return 'Dr'
  
  // Woods
  if (lower.includes('wood')) {
    const match = club.match(/(\d+)\s*wood/i)
    if (match) return `${match[1]}W`
    return 'W'
  }
  
  // Irons
  if (lower.includes('iron')) {
    const match = club.match(/(\d+)\s*iron/i)
    if (match) return `${match[1]}i`
    return 'I'
  }
  
  // Wedges
  if (lower.includes('pitching wedge') || lower.includes('pw')) return 'PW'
  if (lower.includes('gap wedge') || lower.includes('gw')) return 'GW'
  if (lower.includes('sand wedge') || lower.includes('sw')) return 'SW'
  if (lower.includes('lob wedge') || lower.includes('lw')) return 'LW'
  if (lower.includes('wedge')) return 'W'
  
  // Hybrids
  if (lower.includes('hybrid')) {
    const match = club.match(/(\d+)\s*hybrid/i)
    if (match) return `${match[1]}H`
    return 'H'
  }
  
  // Default: return first 2-3 characters
  return club.substring(0, 2).toUpperCase()
}

export const ClubCircles: React.FC<ClubCirclesProps> = ({ clubs }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!clubs || clubs.length === 0) {
    return null
  }

  return (
    <div className="club-circles">
      {clubs.map((club, index) => {
        const abbreviation = getClubAbbreviation(club)
        const isHovered = hoveredIndex === index
        
        return (
          <div
            key={index}
            className={`club-circle ${isHovered ? 'club-circle--hovered' : ''}`}
            style={{
              zIndex: isHovered ? clubs.length + 1 : clubs.length - index,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            title={club}
          >
            <span className="club-circle__text">{abbreviation}</span>
          </div>
        )
      })}
    </div>
  )
}

