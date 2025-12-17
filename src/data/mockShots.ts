import { ShotData } from '../context/ShotDataContext'

// Generate realistic golf shot data
const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

const randomIntInRange = (min: number, max: number): number => {
  return Math.floor(randomInRange(min, max))
}

export const generateMockShot = (shotNumber: number, clubType: 'iron' | 'wood' | 'hybrid' | 'wedge'): ShotData => {
  // Base values vary by club type
  let baseCarry = 150
  let baseBallSpeed = 120
  let baseSpin = 5000
  let baseLaunchAngle = 15

  if (clubType === 'wood') {
    baseCarry = 220
    baseBallSpeed = 150
    baseSpin = 3000
    baseLaunchAngle = 12
  } else if (clubType === 'hybrid') {
    baseCarry = 190
    baseBallSpeed = 135
    baseSpin = 4000
    baseLaunchAngle = 14
  } else if (clubType === 'iron') {
    baseCarry = 150
    baseBallSpeed = 120
    baseSpin = 5500
    baseLaunchAngle = 18
  } else if (clubType === 'wedge') {
    baseCarry = 100
    baseBallSpeed = 90
    baseSpin = 8000
    baseLaunchAngle = 30
  }

  // Add some variation
  const carry = baseCarry + randomInRange(-15, 15)
  const ballSpeed = baseBallSpeed + randomInRange(-5, 5)
  const spinRate = baseSpin + randomInRange(-500, 500)
  const launchAngle = baseLaunchAngle + randomInRange(-2, 2)
  const launchDirection = randomInRange(-3, 3) // degrees
  const spinAxis = randomInRange(-5, 5) // degrees
  const sideSpin = spinRate * Math.sin((spinAxis * Math.PI) / 180)
  const backSpin = spinRate * Math.cos((spinAxis * Math.PI) / 180)
  const sideCarry = carry * Math.sin((launchDirection * Math.PI) / 180)
  const total = carry + randomInRange(10, 30) // roll
  const descentAngle = 45 + randomInRange(-5, 5)
  const clubSpeed = ballSpeed * 1.2 + randomInRange(-3, 3)
  const apex = (carry * Math.tan((launchAngle * Math.PI) / 180)) / 2 + randomInRange(-5, 5)

  // Determine shot type
  let shotType = 'Straight'
  if (Math.abs(launchDirection) > 2) {
    shotType = launchDirection > 0 ? 'Fade' : 'Draw'
  }
  if (Math.abs(spinAxis) > 3) {
    shotType = spinAxis > 0 ? 'Slice' : 'Hook'
  }

  return {
    id: `shot-${shotNumber}-${Date.now()}`,
    shotNumber,
    ballSpeed: Math.round(ballSpeed * 10) / 10,
    launchAngle: Math.round(launchAngle * 10) / 10,
    launchDirection: Math.round(launchDirection * 10) / 10,
    spinRate: Math.round(spinRate),
    spinAxis: Math.round(spinAxis * 10) / 10,
    sideSpin: Math.round(sideSpin),
    backSpin: Math.round(backSpin),
    carry: Math.round(carry),
    sideCarry: Math.round(sideCarry),
    total: Math.round(total),
    descentAngle: Math.round(descentAngle * 10) / 10,
    shotType,
    clubSpeed: Math.round(clubSpeed * 10) / 10,
    apex: Math.round(apex),
  }
}

export const generateFiveShots = (clubType: 'iron' | 'wood' | 'hybrid' | 'wedge'): ShotData[] => {
  return Array.from({ length: 5 }, (_, i) => generateMockShot(i + 1, clubType))
}

