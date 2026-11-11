import { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import AnalyticsListener from './analytics/AnalyticsListener.jsx'
import AppShell from './components/layout/AppShell.jsx'
import { GuestOnly, RequireAuth, RequireOnboarding } from './components/layout/RouteGuards.jsx'
import PageLoader from './components/ui/PageLoader.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Landing from './pages/Landing.jsx'
import LegalPage from './pages/LegalPage.jsx'
import { DISCLAIMER, PRIVACY, TERMS } from './pages/legalContent.js'
import NotFound from './pages/NotFound.jsx'
import { lazyPage, preloadWhenIdle } from './utils/lazyPage.js'

const Login = lazyPage(() => import('./pages/Login.jsx'))
const Signup = lazyPage(() => import('./pages/Signup.jsx'))
const ForgotPassword = lazyPage(() => import('./pages/ForgotPassword.jsx'))
const Pricing = lazyPage(() => import('./pages/Pricing.jsx'))
const Onboarding = lazyPage(() => import('./pages/Onboarding.jsx'))
const Dashboard = lazyPage(() => import('./pages/Dashboard.jsx'))
const Journal = lazyPage(() => import('./pages/Journal.jsx'))
const JournalEditor = lazyPage(() => import('./pages/JournalEditor.jsx'))
const Exercises = lazyPage(() => import('./pages/Exercises.jsx'))
const ExercisePlayer = lazyPage(() => import('./pages/ExercisePlayer.jsx'))
const Insights = lazyPage(() => import('./pages/Insights.jsx'))
const Companion = lazyPage(() => import('./pages/Companion.jsx'))
const Settings = lazyPage(() => import('./pages/Settings.jsx'))

const APP_PAGES = [Dashboard, Journal, JournalEditor, Exercises, ExercisePlayer, Insights, Companion, Settings, Pricing]
const GUEST_PAGES = [Login, Signup, Pricing]

function JournalEntryRoute() {
  const { id } = useParams()
  return <JournalEditor key={id} />
}

function ExerciseRoute() {
  const { id } = useParams()
  return <ExercisePlayer key={id} />
}

export default function App() {
  const { status, user } = useAuth()

  useEffect(() => {
    if (status !== 'ready') return undefined
    return preloadWhenIdle(user ? APP_PAGES : GUEST_PAGES)
  }, [status, user])

  return (
    <>
      <AnalyticsListener />
      <a href="#main" className="sr-only z-[70] rounded-full bg-primary px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<LegalPage {...PRIVACY} />} />
          <Route path="/terms" element={<LegalPage {...TERMS} />} />
          <Route path="/disclaimer" element={<LegalPage {...DISCLAIMER} />} />
          <Route path="/reset-password" element={<Navigate to="/forgot-password" replace />} />

          <Route element={<GuestOnly />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route element={<RequireOnboarding />}>
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/journal/new" element={<JournalEditor key="new" />} />
                <Route path="/journal/:id" element={<JournalEntryRoute />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/exercises/:id" element={<ExerciseRoute />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/companion" element={<Companion />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
