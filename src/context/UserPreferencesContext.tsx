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
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

