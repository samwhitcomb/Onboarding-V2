import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OnboardingProvider } from './context/OnboardingContext'
import { UserPreferencesProvider } from './context/UserPreferencesContext'
import { ShotDataProvider } from './context/ShotDataContext'
import { ClubBagProvider } from './context/ClubBagContext'
import { FlightPlansProvider } from './context/FlightPlansContext'
import OnboardingFlow from './onboarding/OnboardingFlow'

function App() {
  return (
    <BrowserRouter>
      <OnboardingProvider>
        <UserPreferencesProvider>
          <ShotDataProvider>
            <ClubBagProvider>
              <FlightPlansProvider>
                <Routes>
                  <Route path="*" element={<OnboardingFlow />} />
                </Routes>
              </FlightPlansProvider>
            </ClubBagProvider>
          </ShotDataProvider>
        </UserPreferencesProvider>
      </OnboardingProvider>
    </BrowserRouter>
  )
}

export default App

