import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { OnboardingProvider } from './context/OnboardingContext'
import { UserPreferencesProvider } from './context/UserPreferencesContext'
import { ShotDataProvider } from './context/ShotDataContext'
import { ClubBagProvider } from './context/ClubBagContext'
import { FlightPlansProvider } from './context/FlightPlansContext'
import { FeatureCompletionProvider } from './context/FeatureCompletionContext'
import OnboardingFlow from './onboarding/OnboardingFlow'

// Clear all tutorial and onboarding flags on page refresh
const clearOnboardingFlags = () => {
  // Clear all tutorial flags
  const tutorialKeys = [
    'tutorial-practice',
    'tutorial-range',
    'tutorial-target-range',
    'tutorial-courses',
    'tutorial-ctp',
  ]
  
  tutorialKeys.forEach(key => {
    localStorage.removeItem(key)
  })
  
  // Clear other onboarding-related flags
  const onboardingFlags = [
    'exploreFreely',
    'exploreFreelyPromptSeen',
    'customizeBagPromptSeen',
    'hasCustomizedClubs',
    'flightPlansWidgetMinimized',
    'flightPlansHidden',
  ]
  
  onboardingFlags.forEach(key => {
    localStorage.removeItem(key)
  })
  
  // Reset onboarding progress to welcome
  localStorage.setItem('onboardingProgress', JSON.stringify({
    currentStep: 'welcome',
    lastCompletedStep: null,
  }))
  
  console.log('Cleared all onboarding flags - starting fresh')
}

function App() {
  // Clear flags on mount (page refresh)
  useEffect(() => {
    clearOnboardingFlags()
  }, [])

  return (
    <BrowserRouter>
      <OnboardingProvider>
        <UserPreferencesProvider>
          <ShotDataProvider>
            <ClubBagProvider>
              <FlightPlansProvider>
                <FeatureCompletionProvider>
                  <Routes>
                    <Route path="*" element={<OnboardingFlow />} />
                  </Routes>
                </FeatureCompletionProvider>
              </FlightPlansProvider>
            </ClubBagProvider>
          </ShotDataProvider>
        </UserPreferencesProvider>
      </OnboardingProvider>
    </BrowserRouter>
  )
}

export default App

