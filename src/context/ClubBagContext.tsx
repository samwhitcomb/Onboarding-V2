import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { defaultClubs } from '../data/defaultClubs'

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
  addClub: (club: Omit<Club, 'id'>) => void
  updateClub: (id: string, updates: Partial<Club>) => void
  removeClub: (id: string) => void
  initializeDefaultClubs: () => void
}

const STORAGE_KEY = 'clubBag'

const ClubBagContext = createContext<ClubBagContextType | undefined>(undefined)

export const useClubBag = () => {
  const context = useContext(ClubBagContext)
  if (!context) {
    throw new Error('useClubBag must be used within ClubBagProvider')
  }
  return context
}

const hydrate = (): Club[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

const persist = (clubs: Club[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clubs))
  } catch {
    // Ignore storage errors
  }
}

export const ClubBagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [mappedClubs, setMappedClubs] = useState<Club[]>(() => {
    const stored = hydrate()
    // If no stored clubs, initialize with defaults
    if (stored.length === 0) {
      persist(defaultClubs)
      return defaultClubs
    }
    return stored
  })

  // Persist whenever mappedClubs changes
  useEffect(() => {
    persist(mappedClubs)
  }, [mappedClubs])

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

  const addClub = (club: Omit<Club, 'id'>) => {
    const newClub: Club = {
      ...club,
      id: `${club.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setMappedClubs((prev) => [...prev, newClub])
  }

  const updateClub = (id: string, updates: Partial<Club>) => {
    setMappedClubs((prev) =>
      prev.map((club) => (club.id === id ? { ...club, ...updates } : club))
    )
  }

  const removeClub = (id: string) => {
    setMappedClubs((prev) => prev.filter((club) => club.id !== id))
  }

  const initializeDefaultClubs = () => {
    setMappedClubs(defaultClubs)
    persist(defaultClubs)
  }

  return (
    <ClubBagContext.Provider
      value={{
        selectedClub,
        setSelectedClub,
        mappedClubs,
        mapClub,
        addClub,
        updateClub,
        removeClub,
        initializeDefaultClubs,
      }}
    >
      {children}
    </ClubBagContext.Provider>
  )
}

