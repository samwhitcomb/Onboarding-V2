import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Club {
  id: string
  type: 'wood' | 'hybrid' | 'iron' | 'wedge'
  name: string
  number: string
  brand: string
  model: string
  color: string
  gappingData?: {
    averageCarry: number
    averageTotal: number
    averageBallSpeed: number
  }
}

interface ClubBagContextType {
  selectedClub: Club | null
  setSelectedClub: (club: Club | null) => void
  mappedClubs: Club[]
  mapClub: (club: Club, gappingData: Club['gappingData']) => void
}

const ClubBagContext = createContext<ClubBagContextType | undefined>(undefined)

export const useClubBag = () => {
  const context = useContext(ClubBagContext)
  if (!context) {
    throw new Error('useClubBag must be used within ClubBagProvider')
  }
  return context
}

export const ClubBagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [mappedClubs, setMappedClubs] = useState<Club[]>([])

  const mapClub = (club: Club, gappingData: Club['gappingData']) => {
    const updatedClub = { ...club, gappingData }
    setMappedClubs((prev) => {
      const existing = prev.findIndex((c) => c.id === club.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = updatedClub
        return updated
      }
      return [...prev, updatedClub]
    })
  }

  return (
    <ClubBagContext.Provider
      value={{
        selectedClub,
        setSelectedClub,
        mappedClubs,
        mapClub,
      }}
    >
      {children}
    </ClubBagContext.Provider>
  )
}

