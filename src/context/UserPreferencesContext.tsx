import React, { createContext, useContext, useState, ReactNode } from 'react'

export type DistanceUnit = 'yards' | 'meters'
export type PuttingDistanceUnit = 'feet' | 'meters'
export type SpeedUnit = 'mph' | 'mps' | 'kph'
export type DisplayScreen = 'primary' | 'secondary'

interface UserPreferencesContextType {
  distanceUnit: DistanceUnit
  setDistanceUnit: (unit: DistanceUnit) => void
  puttingDistanceUnit: PuttingDistanceUnit
  setPuttingDistanceUnit: (unit: PuttingDistanceUnit) => void
  speedUnit: SpeedUnit
  setSpeedUnit: (unit: SpeedUnit) => void
  displayScreen: DisplayScreen
  setDisplayScreen: (screen: DisplayScreen) => void
  // User profile settings
  name: string
  setName: (name: string) => void
  email: string
  setEmail: (email: string) => void
  handicap: number | null
  setHandicap: (handicap: number | null) => void
  leftHanded: boolean
  setLeftHanded: (leftHanded: boolean) => void
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined)

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext)
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider')
  }
  return context
}

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('yards')
  const [puttingDistanceUnit, setPuttingDistanceUnit] = useState<PuttingDistanceUnit>('feet')
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('mph')
  const [displayScreen, setDisplayScreen] = useState<DisplayScreen>('primary')
  
  // User profile settings with localStorage persistence
  const [name, setNameState] = useState<string>(() => {
    const stored = localStorage.getItem('userName')
    return stored || ''
  })
  const [email, setEmailState] = useState<string>(() => {
    const stored = localStorage.getItem('userEmail')
    return stored || ''
  })
  const [handicap, setHandicapState] = useState<number | null>(() => {
    const stored = localStorage.getItem('userHandicap')
    return stored ? parseFloat(stored) : null
  })
  const [leftHanded, setLeftHandedState] = useState<boolean>(() => {
    const stored = localStorage.getItem('userLeftHanded')
    return stored === 'true'
  })

  const setName = (newName: string) => {
    setNameState(newName)
    localStorage.setItem('userName', newName)
  }

  const setEmail = (newEmail: string) => {
    setEmailState(newEmail)
    localStorage.setItem('userEmail', newEmail)
  }

  const setHandicap = (newHandicap: number | null) => {
    setHandicapState(newHandicap)
    if (newHandicap !== null) {
      localStorage.setItem('userHandicap', newHandicap.toString())
    } else {
      localStorage.removeItem('userHandicap')
    }
  }

  const setLeftHanded = (newLeftHanded: boolean) => {
    setLeftHandedState(newLeftHanded)
    localStorage.setItem('userLeftHanded', newLeftHanded.toString())
  }

  return (
    <UserPreferencesContext.Provider
      value={{
        distanceUnit,
        setDistanceUnit,
        puttingDistanceUnit,
        setPuttingDistanceUnit,
        speedUnit,
        setSpeedUnit,
        displayScreen,
        setDisplayScreen,
        name,
        setName,
        email,
        setEmail,
        handicap,
        setHandicap,
        leftHanded,
        setLeftHanded,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

