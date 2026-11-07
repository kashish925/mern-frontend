import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Logo from '../ui/Logo.jsx'

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted" aria-busy="true" aria-label="Loading">
      <Logo variant="mark" size="lg" to={null} className="animate-floaty !h-16" />
    </div>
  )
}

export function RequireAuth() {
  const { status, user } = useAuth()
  const location = useLocation()
  if (status === 'loading') return <FullPageLoader />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

export function RequireOnboarding() {
  const { onboardingCompleted } = useAuth()
  if (!onboardingCompleted) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

export function GuestOnly() {
  const { status, user, onboardingCompleted } = useAuth()
  if (status === 'loading') return <FullPageLoader />
  if (user) return <Navigate to={onboardingCompleted ? '/dashboard' : '/onboarding'} replace />
  return <Outlet />
}
