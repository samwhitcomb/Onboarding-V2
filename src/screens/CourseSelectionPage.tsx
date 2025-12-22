import React, { useState, useEffect, useRef } from 'react'
import { useOnboarding } from '../context/OnboardingContext'
import { TutorialCourses } from '../onboarding/TutorialCourses'
import { CourseDetailModal } from '../components/CourseDetailModal/CourseDetailModal'
import { SpotlightOverlay } from '../components/SpotlightOverlay/SpotlightOverlay'
import { HeroHeader } from '../components/HeroHeader/HeroHeader'
import { CourseCarousel } from '../components/CourseCarousel/CourseCarousel'
import { CourseCard } from '../components/CourseCard/CourseCard'
import { CarouselSwitcher } from '../components/CarouselSwitcher/CarouselSwitcher'
import { SearchBar } from '../components/SearchBar/SearchBar'
import { FilterPanel } from '../components/FilterPanel/FilterPanel'
import { getBlurb } from '../utils/blurbUtils'
import {
  setLastPlayed,
  getLastPlayed,
  getPlayLater,
  togglePlayLater,
  isPlayLater,
  getRatings,
  setRating,
  getRating,
  migrateFavoritesToRatings,
} from '../utils/userPreferences'
import coursesData from '../data/courses.json'
import './CourseSelectionPage.css'

interface Course {
  id: string
  name: string
  description?: string
  location: string
  rating: number
  type?: string
  yardage?: number
  isStudio?: boolean
  hasStandardVersion?: boolean
  imageUrl?: string
  hasImage?: boolean
  continent?: string
  batch?: string
  architect?: string
  blurb?: string[]
  userRating?: number
}

export const CourseSelectionPage: React.FC = () => {
  const { setCurrentStep } = useOnboarding()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<{
    continent: string | null
    mood: string | null
    type: string | null
    contentTier: string | null
  }>({ continent: null, mood: null, type: null, contentTier: null })
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'smart' | 'curated'>('smart')
  const [ratings, setRatings] = useState<Map<string, number>>(new Map())
  const [playLater, setPlayLater] = useState<Set<string>>(new Set())
  const [showTutorial, setShowTutorial] = useState(false)
  const [showCourseGuidance, setShowCourseGuidance] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load courses from JSON
    const coursesWithImages = coursesData.map((course: any) => {
      const imageName = course.id || course.name.toLowerCase().replace(/\s+/g, '-')
      // Use public folder path - account for Vite base path
      const basePath = import.meta.env.BASE_URL || '/'
      const imagePath = `${basePath}courses/${imageName}_hero.jpg`

      return {
        ...course,
        imageUrl: course.imageUrl || imagePath,
        hasImage: course.hasImage !== undefined ? course.hasImage : true,
      }
    })

    setCourses(coursesWithImages)
    setFilteredCourses(coursesWithImages)
    setLoading(false)

    // Migrate favorites to ratings on first load
    migrateFavoritesToRatings()
    // Load ratings and play later from localStorage
    setRatings(getRatings())
    setPlayLater(getPlayLater())

    // Check if user has seen tutorial - show it after page loads
    const hasSeenTutorial = localStorage.getItem('tutorial-courses') === 'true'
    if (!hasSeenTutorial) {
      // Show tutorial after a short delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        setShowTutorial(true)
      }, 500)
      
      // Listen for tutorial dismissal and choose-course phase
      const handleTutorialDismissed = () => {
        setShowTutorial(false)
        setShowCourseGuidance(false)
      }
      const handleChoosePhase = () => {
        setShowTutorial(false)
        // Show guidance after a short delay to let tutorial close
        setTimeout(() => {
          setShowCourseGuidance(true)
        }, 300)
      }
      
      window.addEventListener('tutorial-courses-dismissed', handleTutorialDismissed)
      window.addEventListener('tutorial-courses-choose-phase', handleChoosePhase)
      
      return () => {
        clearTimeout(timer)
        window.removeEventListener('tutorial-courses-dismissed', handleTutorialDismissed)
        window.removeEventListener('tutorial-courses-choose-phase', handleChoosePhase)
      }
    }

    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 50) {
          headerRef.current.classList.add('scrolled')
        } else {
          headerRef.current.classList.remove('scrolled')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    applyFilters()
  }, [courses, searchQuery, filters])

  const applyFilters = () => {
    let filtered = [...courses]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (query === 'studio' || query === 'studios') {
        filtered = filtered.filter((course) => course.isStudio === true)
      } else {
        filtered = filtered.filter(
          (course) =>
            course.name.toLowerCase().includes(query) ||
            course.location.toLowerCase().includes(query) ||
            course.description?.toLowerCase().includes(query) ||
            (query.includes('studio') && course.isStudio === true)
        )
      }
    }

    // Mood filter
    if (filters.mood) {
      if (filters.mood === 'chill') {
        filtered = filtered.filter((c) => c.rating < 4.0 || c.type === 'resort')
      } else if (filters.mood === 'challenge') {
        filtered = filtered.filter((c) => c.rating >= 4.5 || c.type === 'championship')
      } else if (filters.mood === 'practice') {
        filtered = filtered.filter((c) => c.type === 'parkland')
      }
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter((c) => c.type === filters.type)
    }

    // Continent filter
    if (filters.continent) {
      filtered = filtered.filter((c) => c.continent === filters.continent)
    }

    // Content Tier filter
    if (filters.contentTier === 'studio') {
      filtered = filtered.filter((c) => c.isStudio === true)
    } else if (filters.contentTier === 'free') {
      filtered = filtered.filter((c) => !c.isStudio || c.isStudio === false)
    }

    setFilteredCourses(filtered)
  }

  const handleFilterChange = (filterType: string, value: string | null) => {
    if (filterType === 'clear') {
      setFilters({ continent: null, mood: null, type: null, contentTier: null })
      setSearchQuery('')
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterType]: prev[filterType as keyof typeof prev] === value ? null : value,
      }))
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course)
    // Hide guidance when a course is selected
    setShowCourseGuidance(false)
  }

  const closeModal = () => {
    setSelectedCourse(null)
  }

  const handleRatingChange = (courseId: string, rating: number) => {
    setRating(courseId, rating)
    setRatings(new Map(getRatings()))
  }

  const handlePlayLaterToggle = (courseId: string) => {
    togglePlayLater(courseId)
    setPlayLater(new Set(getPlayLater()))
  }

  const handleCoursePlay = (courseId: string) => {
    setLastPlayed(courseId)
    setPlayLater(new Set(getPlayLater()))
  }

  // Get smart list carousels
  const getSmartListCarousels = () => {
    const hasActiveFilters = filters.continent || filters.mood || filters.type || filters.contentTier
    const coursesToUse = hasActiveFilters && !searchQuery ? filteredCourses : courses
    const allCourses = coursesToUse.filter((c) => c.hasImage)
    const lastPlayedId = getLastPlayed()
    const lastPlayedCourse = lastPlayedId
      ? courses.find((c) => c.id === lastPlayedId)
      : courses.find((c) => c.id === 'st-andrews') || null

    // Trending Now
    const studioCourses = allCourses.filter((c) => c.isStudio === true)
    const nonStudioCourses = allCourses.filter((c) => !c.isStudio || c.isStudio === false)
    const sortedStudio = studioCourses.sort((a, b) => b.rating - a.rating)
    const sortedNonStudio = nonStudioCourses.sort((a, b) => b.rating - a.rating)
    const trending = [...sortedStudio.slice(0, 4), ...sortedNonStudio.slice(0, 6)].slice(0, 10)

    // Because you played...
    let becauseYouPlayed: Course[] = []
    if (lastPlayedCourse) {
      becauseYouPlayed = allCourses
        .filter((c) => {
          if (c.id === lastPlayedCourse.id) return false
          const sameType = c.type === lastPlayedCourse.type
          const similarRating = Math.abs(c.rating - lastPlayedCourse.rating) <= 0.5
          const sameContinent = c.continent === lastPlayedCourse.continent
          return (sameType && similarRating) || (sameContinent && similarRating)
        })
        .sort((a, b) => {
          const aSameType = a.type === lastPlayedCourse.type ? 1 : 0
          const bSameType = b.type === lastPlayedCourse.type ? 1 : 0
          const aSameContinent = a.continent === lastPlayedCourse.continent ? 1 : 0
          const bSameContinent = b.continent === lastPlayedCourse.continent ? 1 : 0
          if (aSameType !== bSameType) return bSameType - aSameType
          if (aSameContinent !== bSameContinent) return bSameContinent - aSameContinent
          return b.rating - a.rating
        })
        .slice(0, 10)
    }

    // Play Later
    const playLaterList = allCourses.filter((c) => playLater.has(c.id)).sort((a, b) => b.rating - a.rating)

    // Rated Courses
    const ratedCoursesList: (Course | { type: 'divider'; label: string })[] = (() => {
      const ratedCourseIds = Array.from(ratings.keys())
      if (ratedCourseIds.length === 0) return []

      const ratedCourses = allCourses
        .filter((c) => ratings.has(c.id))
        .map((c) => ({
          ...c,
          userRating: ratings.get(c.id),
        }))
        .sort((a, b) => (b.userRating || 0) - (a.userRating || 0))

      const grouped: Record<number, Course[]> = { 5: [], 4: [], 3: [], 2: [], 1: [] }

      ratedCourses.forEach((course) => {
        const rating = course.userRating
        if (rating && rating >= 1 && rating <= 5) {
          grouped[rating].push(course)
        }
      })

      const result: (Course | { type: 'divider'; label: string })[] = []
      const tiers = [5, 4, 3, 2, 1]

      tiers.forEach((tier) => {
        if (grouped[tier].length > 0) {
          result.push({ type: 'divider', label: `${tier} Stars` })
          result.push(...grouped[tier])
        }
      })

      return result
    })()

    // For You
    let forYou: Course[] = []
    if (ratings.size > 0) {
      const ratedCourses = allCourses.filter((c) => ratings.has(c.id))
      const avgRating = ratedCourses.reduce((sum, c) => sum + c.rating, 0) / ratedCourses.length
      const ratedTypes = new Set(ratedCourses.map((c) => c.type).filter(Boolean))
      const ratedContinents = new Set(ratedCourses.map((c) => c.continent).filter(Boolean))

      forYou = allCourses
        .filter((c) => {
          if (ratings.has(c.id)) return false
          const similarRating = Math.abs(c.rating - avgRating) <= 0.5
          const matchesType = ratedTypes.has(c.type || '')
          const matchesContinent = ratedContinents.has(c.continent || '')
          return similarRating && (matchesType || matchesContinent)
        })
        .sort((a, b) => {
          const aMatchesType = ratedTypes.has(a.type || '') ? 1 : 0
          const bMatchesType = ratedTypes.has(b.type || '') ? 1 : 0
          const aMatchesContinent = ratedContinents.has(a.continent || '') ? 1 : 0
          const bMatchesContinent = ratedContinents.has(b.continent || '') ? 1 : 0
          if (aMatchesType !== bMatchesType) return bMatchesType - aMatchesType
          if (aMatchesContinent !== bMatchesContinent) return bMatchesContinent - aMatchesContinent
          return b.rating - a.rating
        })
        .slice(0, 15)
    } else if (lastPlayedCourse) {
      forYou = allCourses
        .filter((c) => {
          if (c.id === lastPlayedCourse.id) return false
          return Math.abs(c.rating - lastPlayedCourse.rating) <= 0.5
        })
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 15)
    } else {
      forYou = allCourses
        .filter((c) => c.rating >= 4.0 && c.rating <= 4.5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 15)
    }

    return {
      trending,
      becauseYouPlayed,
      playLaterList,
      ratedCoursesList,
      forYou,
      lastPlayedCourse,
    }
  }

  // Get curated carousels
  const getCuratedCarousels = () => {
    const hasActiveFilters = filters.continent || filters.mood || filters.type || filters.contentTier
    const coursesToUse = hasActiveFilters && !searchQuery ? filteredCourses : courses
    const allCourses = coursesToUse.filter((c) => c.hasImage)

    return {
      absoluteIcons: allCourses
        .filter((c) => c.batch === 'Absolute Icons & Major Venues')
        .sort((a, b) => b.rating - a.rating),
      premierLinks: allCourses
        .filter((c) => c.batch === 'Premier Global Links & Sandbelt')
        .sort((a, b) => b.rating - a.rating),
      goldenAge: allCourses
        .filter((c) => c.batch === 'Classic American Golden Age Designs')
        .sort((a, b) => b.rating - a.rating),
      historicInternational: allCourses
        .filter((c) => c.batch === 'Historic & Championship International Links')
        .sort((a, b) => b.rating - a.rating),
      modernIcons: allCourses
        .filter((c) => c.batch === 'Modern American Icons & Stadium Courses')
        .sort((a, b) => b.rating - a.rating),
      destinationResort: allCourses
        .filter((c) => c.batch === 'Destination & Scenic Resort Courses')
        .sort((a, b) => b.rating - a.rating),
      desertMountain: allCourses
        .filter((c) => c.batch === 'Desert & Mountain Classics')
        .sort((a, b) => b.rating - a.rating),
      strategicArtistic: allCourses
        .filter((c) => c.batch === 'Strategic & Artistic Gems')
        .sort((a, b) => b.rating - a.rating),
      international: allCourses
        .filter((c) => c.continent && c.continent !== 'North America' && c.continent !== 'Unknown')
        .sort((a, b) => b.rating - a.rating),
      studioOriginals: allCourses
        .filter((c) => c.isStudio === true)
        .sort((a, b) => b.rating - a.rating),
    }
  }

  if (loading) {
    return (
      <div className="browse-app">
        <div className="loading-screen">Loading courses...</div>
      </div>
    )
  }

  const featuredCourse = null

  return (
    <div className="browse-app">
      <div className="browse-header" ref={headerRef}>
        <h1>Rapsodo Courses</h1>
        <div className="header-search">
          <SearchBar onSearch={handleSearch} placeholder="Search courses..." value={searchQuery} />
        </div>
        <div className="header-actions">
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button className="course-selection-back" onClick={() => setCurrentStep('complete')}>
            ← Back
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-container">
          <div className="filters-content">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>
      )}

      {searchQuery && (
        <div className="search-results-overlay">
          <div className="search-results-container">
            <div className="search-results-header">
              <h2>Search Results for "{searchQuery}"</h2>
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                Clear Search
              </button>
            </div>
            <div className="search-results-grid">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course.id} className="search-result-card">
                    <CourseCard course={course} onClick={() => handleCourseClick(course)} />
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No courses found matching "{searchQuery}"</p>
                  <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`main-content ${searchQuery ? 'dimmed' : ''}`}>
        <HeroHeader featuredCourse={featuredCourse} onTeeOffClick={handleCoursePlay} />

        <div className="browse-content">
          <CarouselSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'smart' && (() => {
            const smartCarousels = getSmartListCarousels()
            return (
              <>
                {smartCarousels.trending.length > 0 && (
                  <CourseCarousel
                    title="Trending Now"
                    courses={smartCarousels.trending}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {smartCarousels.becauseYouPlayed.length > 0 && smartCarousels.lastPlayedCourse && (
                  <CourseCarousel
                    title={`Because you played ${smartCarousels.lastPlayedCourse.name}`}
                    description="Similar courses with a similar difficulty"
                    courses={smartCarousels.becauseYouPlayed}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {smartCarousels.playLaterList.length > 0 && (
                  <CourseCarousel
                    title="Play Later"
                    courses={smartCarousels.playLaterList}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {smartCarousels.ratedCoursesList.length > 0 && (
                  <CourseCarousel
                    title="Rated Courses"
                    courses={smartCarousels.ratedCoursesList}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {smartCarousels.forYou.length > 0 && (
                  <CourseCarousel
                    title="For You"
                    courses={smartCarousels.forYou}
                    onCourseClick={handleCourseClick}
                  />
                )}
              </>
            )
          })()}

          {activeTab === 'curated' && (() => {
            const curatedCarousels = getCuratedCarousels()
            return (
              <>
                {curatedCarousels.absoluteIcons.length > 0 && (
                  <CourseCarousel
                    title="Absolute Icons & Major Venues"
                    description="The most historically significant and globally recognized championship courses, each a foundational pillar of golf's story."
                    courses={curatedCarousels.absoluteIcons}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {curatedCarousels.premierLinks.length > 0 && (
                  <CourseCarousel
                    title="Premier Global Links & Sandbelt"
                    description="The world's finest links and the unique sandbelt style, where firm, fast-running ground and strategic design create the purest forms of the game."
                    courses={curatedCarousels.premierLinks}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {curatedCarousels.goldenAge.length > 0 && (
                  <CourseCarousel
                    title="Classic American Golden Age Designs"
                    description="The foundational inland masterpieces of the early 20th century, showcasing the strategic genius of architects like Tillinghast, Ross, Raynor, and MacKenzie."
                    courses={curatedCarousels.goldenAge}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {curatedCarousels.historicInternational.length > 0 && (
                  <CourseCarousel
                    title="Historic & Championship International Links"
                    description="Legendary Open Championship venues and other historic links from the British Isles, where golf's oldest major has been defined by wind, bunkers, and dramatic finishes."
                    courses={curatedCarousels.historicInternational}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {curatedCarousels.modernIcons.length > 0 && (
                  <CourseCarousel
                    title="Modern American Icons & Stadium Courses"
                    description="Influential and often dramatic designs from the late 20th and 21st centuries that have become major championship venues and bucket-list destinations."
                    courses={curatedCarousels.modernIcons}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {curatedCarousels.destinationResort.length > 0 && (
                  <CourseCarousel
                    title="Destination & Scenic Resort Courses"
                    description="World-class golf at destination resorts, where course design is masterfully integrated with stunning natural landscapes—from ocean cliffs to tropical jungles."
                    courses={curatedCarousels.destinationResort}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {curatedCarousels.desertMountain.length > 0 && (
                  <CourseCarousel
                    title="Desert & Mountain Classics"
                    description="The unique artistry of creating championship golf in arid and mountainous environments, using dramatic elevation changes and breathtaking vistas."
                    courses={curatedCarousels.desertMountain}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {curatedCarousels.strategicArtistic.length > 0 && (
                  <CourseCarousel
                    title="Strategic & Artistic Gems"
                    description="Brilliant, often under-the-radar courses designed by master architects, revered for their strategic depth, artistic flair, and pure, unadulterated fun."
                    courses={curatedCarousels.strategicArtistic}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {curatedCarousels.international.length > 0 && (
                  <CourseCarousel
                    title="International Courses"
                    description="Championship courses from around the world, showcasing the global diversity of golf architecture and the unique challenges of different continents."
                    courses={curatedCarousels.international}
                    onCourseClick={handleCourseClick}
                  />
                )}

                {curatedCarousels.studioOriginals.length > 0 && (
                  <CourseCarousel
                    title="Studio Originals"
                    description="Experience Lidar Detail - Premium courses with sub-centimeter accuracy"
                    courses={curatedCarousels.studioOriginals}
                    onCourseClick={handleCourseClick}
                  />
                )}
              </>
            )
          })()}
        </div>
      </div>
      
      {/* Show tutorial modal if user hasn't seen it yet */}
      {showTutorial && (
        <TutorialCourses />
      )}

      {/* Show spotlight guidance to choose a course */}
      {showCourseGuidance && !selectedCourse && (
        <>
          <SpotlightOverlay 
            targetSelector=".course-card-browse:first-of-type"
            enabled={true}
          />
          <div style={{
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#ffffff',
            padding: '20px 40px',
            borderRadius: '12px',
            zIndex: 2000,
            textAlign: 'center',
            maxWidth: '600px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            border: '2px solid #667eea'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 600 }}>
              Choose a Course
            </h3>
            <p style={{ margin: 0, fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)' }}>
              Click on any course card above to view details and set up your game
            </p>
          </div>
        </>
      )}

      {/* Show course detail modal when a course is selected */}
      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={closeModal}
          userRating={getRating(selectedCourse.id)}
          onRatingChange={(rating) => {
            setRating(selectedCourse.id, rating)
            setRatings(getRatings())
          }}
          isPlayLater={isPlayLater(selectedCourse.id)}
          onPlayLaterToggle={() => {
            togglePlayLater(selectedCourse.id)
            setPlayLater(getPlayLater())
          }}
          onTeeOffClick={() => {
            handleCoursePlay(selectedCourse.id)
            closeModal()
            // Store course info and navigate to course play loading
            // Dispatch event to pass course info to OnboardingFlow
            // Store course name in sessionStorage for CourseplayWarmup
            sessionStorage.setItem('selectedCourseName', selectedCourse.name)
            window.dispatchEvent(new CustomEvent('course-tee-off', {
              detail: {
                courseName: selectedCourse.name,
                courseLocation: selectedCourse.location
              }
            }))
            // Navigate to course play loading screen
            setCurrentStep('course-play-loading')
          }}
        />
      )}
    </div>
  )
}
