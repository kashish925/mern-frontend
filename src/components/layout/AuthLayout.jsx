import { Link } from 'react-router-dom'
import heroSky from '../../assets/hero-sky.jpg'
import Logo from '../ui/Logo.jsx'
import ThemeToggle from '../ui/ThemeToggle.jsx'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main id="main" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <img src={heroSky} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-surface/20 dark:bg-surface-muted/70" />
      <ThemeToggle className="absolute right-4 top-4 bg-surface/70 backdrop-blur" />
      <div className="relative w-full max-w-md">
        <div className="glass animate-fadeup rounded-3xl p-7 sm:p-9">
          <div className="mb-6 flex justify-center">
            <Logo variant="full" to="/" className="!w-40" />
          </div>
          <h1 className="text-center font-display text-3xl font-semibold">{title}</h1>
          {subtitle ? <p className="mt-2 text-center text-sm text-ink-muted">{subtitle}</p> : null}
          <div className="mt-7">{children}</div>
        </div>
        {footer ? <div className="mt-5 text-center text-sm font-semibold text-ink">{footer}</div> : null}
        <p className="mt-6 text-center text-xs text-ink/70">
          <Link to="/privacy" className="hover:underline">Privacy</Link> · <Link to="/terms" className="hover:underline">Terms</Link> ·{' '}
          <Link to="/disclaimer" className="hover:underline">Not medical care</Link>
        </p>
      </div>
    </main>
  )
}
