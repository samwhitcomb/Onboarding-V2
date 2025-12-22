import React, { useState, useEffect } from 'react'
import { useClubBag, Club } from '../context/ClubBagContext'
import { useUserPreferences } from '../context/UserPreferencesContext'
import { SettingsModal } from '../onboarding/SettingsModal'
import { CustomizeBagPrompt } from '../components/CustomizeBagPrompt/CustomizeBagPrompt'
import { SpotlightOverlay } from '../components/SpotlightOverlay/SpotlightOverlay'
import { ClubBagModal } from '../components/ClubBagModal/ClubBagModal'
import bagImage from '../assets/images/Consumer/f81efd4590c33d6b415cf23d37184c0469f4f9e2.png'
import './ProfilePage.css'

export const ProfilePage: React.FC = () => {
  const { mappedClubs } = useClubBag()
  const { 
    distanceUnit, 
    speedUnit, 
    puttingDistanceUnit,
    name,
    email,
    handicap,
    leftHanded,
  } = useUserPreferences()
  const [showSettings, setShowSettings] = useState(false)
  const [showCustomizeBagPrompt, setShowCustomizeBagPrompt] = useState(false)
  const [showClubBagModal, setShowClubBagModal] = useState(false)

  // Show customize bag prompt when navigating to profile page
  // Show if user hasn't customized clubs yet (regardless of whether they've seen the prompt)
  useEffect(() => {
    const hasCustomizedClubs = localStorage.getItem('hasCustomizedClubs') === 'true'
    
    // Show prompt if user hasn't customized clubs yet
    // This will show every time they navigate to profile until they customize
    if (!hasCustomizedClubs) {
      // Show prompt after a short delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setShowCustomizeBagPrompt(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, []) // Empty deps - runs when component mounts (when navigating to profile)
  
  // Temporary: Add a way to test the prompt (can be removed later)
  // Press 'P' key to toggle prompt for testing
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if not in an input field
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      
      if (e.key === 'p' || e.key === 'P') {
        if (e.shiftKey) {
          // Shift+P: Reset flags and show prompt
          localStorage.removeItem('customizeBagPromptSeen')
          localStorage.removeItem('hasCustomizedClubs')
          setShowCustomizeBagPrompt(true)
        } else {
          // P: Toggle prompt
          setShowCustomizeBagPrompt(prev => !prev)
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Mock player stats
  const playerStats = {
    handicap: 8.2,
    roundsPlayed: 47,
    bestScore: 72,
    averageScore: 84.3,
    totalShots: 3847,
    practiceHours: 124,
    longestDrive: 312,
    bestRound: {
      score: 72,
      course: 'Pebble Beach Golf Links',
      date: '2024-03-15',
    },
    achievements: [
      { title: 'Eagle Hunter', description: 'Scored 5 eagles this season', icon: '🦅' },
      { title: 'Consistency King', description: '10 rounds under 80', icon: '👑' },
      { title: 'Range Master', description: '100+ hours of practice', icon: '🎯' },
    ],
  }


  return (
    <div className="profile-page">
      <div className="profile-page__content">
        {/* Header */}
        <div className="profile-page__header">
          <div className="profile-page__header-content">
            <h1 className="profile-page__title">Player Profile</h1>
            <button
              className="profile-page__settings-button"
              onClick={() => setShowSettings(true)}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* User Settings */}
        <div className="profile-page__section profile-page__section--settings">
          <div className="profile-page__settings-grid">
            <div className="profile-page__setting-item">
              <span className="profile-page__setting-label">Name</span>
              <span className="profile-page__setting-value">{name || 'Not set'}</span>
            </div>
            <div className="profile-page__setting-item">
              <span className="profile-page__setting-label">Email</span>
              <span className="profile-page__setting-value">{email || 'Not set'}</span>
            </div>
            <div className="profile-page__setting-item">
              <span className="profile-page__setting-label">Handicap</span>
              <span className="profile-page__setting-value">{handicap !== null ? handicap.toFixed(1) : 'Not set'}</span>
            </div>
            <div className="profile-page__setting-item">
              <span className="profile-page__setting-label">Handedness</span>
              <span className="profile-page__setting-value">{leftHanded ? 'Left Handed' : 'Right Handed'}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid and My Bag */}
        <div className="profile-page__section profile-page__section--main-grid">
          {/* Performance Stats */}
          <div className="profile-page__stats-section">
            <h2 className="profile-page__section-title">Performance Stats</h2>
            <div className="profile-page__stats-grid">
            <div className="profile-page__stat-card">
              <div className="profile-page__stat-label">Handicap</div>
              <div className="profile-page__stat-value">{playerStats.handicap}</div>
            </div>
            <div className="profile-page__stat-card">
              <div className="profile-page__stat-label">Rounds Played</div>
              <div className="profile-page__stat-value">{playerStats.roundsPlayed}</div>
            </div>
            <div className="profile-page__stat-card">
              <div className="profile-page__stat-label">Best Score</div>
              <div className="profile-page__stat-value">{playerStats.bestScore}</div>
            </div>
            <div className="profile-page__stat-card">
              <div className="profile-page__stat-label">Average Score</div>
              <div className="profile-page__stat-value">{playerStats.averageScore.toFixed(1)}</div>
            </div>
            <div className="profile-page__stat-card">
              <div className="profile-page__stat-label">Total Shots</div>
              <div className="profile-page__stat-value">{playerStats.totalShots.toLocaleString()}</div>
            </div>
            <div className="profile-page__stat-card">
              <div className="profile-page__stat-label">Practice Hours</div>
              <div className="profile-page__stat-value">{playerStats.practiceHours}</div>
            </div>
            <div className="profile-page__stat-card">
              <div className="profile-page__stat-label">Longest Drive</div>
              <div className="profile-page__stat-value">
                {playerStats.longestDrive} {distanceUnit === 'yards' ? 'yds' : 'm'}
              </div>
            </div>
            <div className="profile-page__stat-card profile-page__stat-card--highlight">
              <div className="profile-page__stat-label">Best Round</div>
              <div className="profile-page__stat-value">{playerStats.bestRound.score}</div>
              <div className="profile-page__stat-detail">{playerStats.bestRound.course}</div>
              <div className="profile-page__stat-detail">{playerStats.bestRound.date}</div>
            </div>
          </div>
          </div>

          {/* My Bag */}
          <div 
            className="profile-page__bag-section profile-page__bag-section--clickable" 
            id="my-bag-section"
            onClick={() => setShowClubBagModal(true)}
          >
            <div className="profile-page__bag-header">
              <h2 className="profile-page__section-title">My Bag</h2>
              <div className="profile-page__bag-image-container">
                <img 
                  src={bagImage} 
                  alt="Golf Bag" 
                  className="profile-page__bag-image"
                />
              </div>
            </div>
            {mappedClubs.length === 0 ? (
              <div className="profile-page__empty-state">
                <p>No clubs mapped yet. Click to add clubs.</p>
              </div>
            ) : (
              <div className="profile-page__bag-clubs-grid">
                {mappedClubs.map((club) => {
                  // Get initials from club name or number
                  const getInitials = (club: Club): string => {
                    if (club.number) {
                      // Use number if available (e.g., "7i" -> "7i", "3w" -> "3w")
                      return club.number.length <= 3 ? club.number : club.number.substring(0, 3)
                    }
                    // Use first 2-3 characters of name
                    return club.name.length <= 3 ? club.name : club.name.substring(0, 3)
                  }
                  
                  const initials = getInitials(club)
                  
                  return (
                    <div 
                      key={club.id} 
                      className="profile-page__bag-club-circle"
                      style={{ backgroundColor: club.color }}
                      title={`${club.number || club.name} - ${club.brand} ${club.model}`}
                    >
                      <span className="profile-page__bag-club-initials">{initials}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="profile-page__section">
          <h2 className="profile-page__section-title">Achievements</h2>
          <div className="profile-page__achievements">
            {playerStats.achievements.map((achievement, index) => (
              <div key={index} className="profile-page__achievement">
                <div className="profile-page__achievement-icon">{achievement.icon}</div>
                <div className="profile-page__achievement-content">
                  <div className="profile-page__achievement-title">{achievement.title}</div>
                  <div className="profile-page__achievement-description">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unit Preferences */}
        <div className="profile-page__section">
          <h2 className="profile-page__section-title">Unit Preferences</h2>
          <div className="profile-page__preferences">
            <div className="profile-page__preference-item">
              <span className="profile-page__preference-label">Distance</span>
              <span className="profile-page__preference-value">{distanceUnit === 'yards' ? 'Yards' : 'Meters'}</span>
            </div>
            <div className="profile-page__preference-item">
              <span className="profile-page__preference-label">Putting Distance</span>
              <span className="profile-page__preference-value">{puttingDistanceUnit === 'feet' ? 'Feet' : 'Meters'}</span>
            </div>
            <div className="profile-page__preference-item">
              <span className="profile-page__preference-label">Speed</span>
              <span className="profile-page__preference-value">{speedUnit === 'mph' ? 'MPH' : 'KPH'}</span>
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
      {showClubBagModal && (
        <ClubBagModal onClose={() => setShowClubBagModal(false)} />
      )}
      {showCustomizeBagPrompt && (
        <>
          <SpotlightOverlay 
            targetSelector="#my-bag-section"
            enabled={showCustomizeBagPrompt}
            strokeOnly={true}
          />
          <CustomizeBagPrompt 
            targetSelector="#my-bag-section"
            onDismiss={() => {
              setShowCustomizeBagPrompt(false)
              localStorage.setItem('customizeBagPromptSeen', 'true')
            }} 
          />
        </>
      )}
    </div>
  )
}

