export interface CourseHole {
  number: number
  par: number
  yards: number
  index: number
  name?: string
  description?: string
}

export interface Course {
  id: string
  name: string
  holes: CourseHole[]
}

export const pebbleBeach: Course = {
  id: 'pebble-beach',
  name: 'Pebble Beach',
  holes: [
    {
      number: 6,
      par: 5,
      yards: 523,
      index: 8,
      name: 'Hole 6',
      description: 'A challenging par 5 with ocean views',
    },
    {
      number: 7,
      par: 3,
      yards: 107,
      index: 18,
      name: 'Hole 7',
      description: 'The iconic par 3 over the Pacific',
    },
  ],
}

export const getHole = (courseId: string, holeNumber: number): CourseHole | undefined => {
  const course = pebbleBeach // For now, only Pebble Beach
  return course.holes.find((hole) => hole.number === holeNumber)
}

