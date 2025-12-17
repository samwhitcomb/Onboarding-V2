import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface ShotData {
  id: string
  shotNumber: number
  ballSpeed: number
  launchAngle: number
  launchDirection: number
  spinRate: number
  spinAxis: number
  sideSpin: number
  backSpin: number
  carry: number
  sideCarry: number
  total: number
  descentAngle: number
  shotType: string
  clubSpeed: number
  apex: number
}

interface ShotDataContextType {
  shots: ShotData[]
  addShot: (shot: ShotData) => void
  clearShots: () => void
  getAverageData: () => Partial<ShotData> | null
}

const ShotDataContext = createContext<ShotDataContextType | undefined>(undefined)

export const useShotData = () => {
  const context = useContext(ShotDataContext)
  if (!context) {
    throw new Error('useShotData must be used within ShotDataProvider')
  }
  return context
}

export const ShotDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shots, setShots] = useState<ShotData[]>([])

  const addShot = (shot: ShotData) => {
    setShots((prev) => [...prev, shot])
  }

  const clearShots = () => {
    setShots([])
  }

  const getAverageData = (): Partial<ShotData> | null => {
    if (shots.length === 0) return null

    const averages: Partial<ShotData> = {
      ballSpeed: shots.reduce((sum, s) => sum + s.ballSpeed, 0) / shots.length,
      launchAngle: shots.reduce((sum, s) => sum + s.launchAngle, 0) / shots.length,
      launchDirection: shots.reduce((sum, s) => sum + s.launchDirection, 0) / shots.length,
      spinRate: shots.reduce((sum, s) => sum + s.spinRate, 0) / shots.length,
      spinAxis: shots.reduce((sum, s) => sum + s.spinAxis, 0) / shots.length,
      sideSpin: shots.reduce((sum, s) => sum + s.sideSpin, 0) / shots.length,
      backSpin: shots.reduce((sum, s) => sum + s.backSpin, 0) / shots.length,
      carry: shots.reduce((sum, s) => sum + s.carry, 0) / shots.length,
      sideCarry: shots.reduce((sum, s) => sum + s.sideCarry, 0) / shots.length,
      total: shots.reduce((sum, s) => sum + s.total, 0) / shots.length,
      descentAngle: shots.reduce((sum, s) => sum + s.descentAngle, 0) / shots.length,
      clubSpeed: shots.reduce((sum, s) => sum + s.clubSpeed, 0) / shots.length,
      apex: shots.reduce((sum, s) => sum + s.apex, 0) / shots.length,
    }

    return averages
  }

  return (
    <ShotDataContext.Provider
      value={{
        shots,
        addShot,
        clearShots,
        getAverageData,
      }}
    >
      {children}
    </ShotDataContext.Provider>
  )
}

