import { Suspense } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { track } from '../../analytics/track.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { NoIndex } from '../SEO.jsx'
import Icon from '../ui/Icon.jsx'
import Logo from '../ui/Logo.jsx'
import PageLoader from '../ui/PageLoader.jsx'
import ThemeToggle from '../ui/ThemeToggle.jsx'
import TrialBanner from '../feature/TrialBanner.jsx'
import { APP_NAV } from './navItems.js'

function SideLink({ item, locked }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
          isActive ? 'bg-brand-soft text-primary shadow-soft' : 'text-ink-muted hover:bg-lavender-mist hover:text-ink'
        }`
      }
    >
      <Icon name={item.icon} />
      <span className="flex-1">{item.label}</span>
      {locked ? <Icon name="lock" size={16} className="text-ink-faint" title="Paid plans" /> : null}
    </NavLink>
  )
}

export default function AppShell() {
  const { user, access, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = async () => {
    track('logout')
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <NoIndex />
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-surface/80 px-4 py-6 backdrop-blur-xl lg:flex">
        <div className="flex items-center justify-between gap-2 px-2">
          <Logo to="/dashboard" />
          <ThemeToggle />
        </div>
        <nav className="mt-8 flex-1 space-y-1" aria-label="App">
          {APP_NAV.map((item) => (
            <SideLink key={item.to} item={item} locked={Boolean(item.paidFeature) && !access?.[item.paidFeature]} />
          ))}
        </nav>
        <div className="rounded-2xl bg-brand-soft p-4">
          <p className="truncate text-sm font-extrabold">{user?.name}</p>
          <p className="truncate text-xs text-ink-muted">{user?.email}</p>
          <button
            type="button"
            onClick={onLogout}
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark"
          >
            <Icon name="logout" size={16} /> Log out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface/85 px-4 py-2 backdrop-blur-xl lg:hidden">
        <Logo variant="mark" size="md" to="/dashboard" />
        <span className="font-display text-lg font-semibold">HappiTrack</span>
        <div className="flex items-center">
          <ThemeToggle />
          <button type="button" onClick={onLogout} className="rounded-full p-2 text-ink-muted hover:bg-lavender-mist" aria-label="Log out">
            <Icon name="logout" />
          </button>
        </div>
      </header>

      <div className="lg:pl-64">
        <TrialBanner />
        <main id="main" className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12 lg:pt-10">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-line bg-surface/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
        aria-label="App"
      >
        {APP_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold ${isActive ? 'text-primary' : 'text-ink-faint'}`
            }
          >
            <Icon name={item.icon} size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
