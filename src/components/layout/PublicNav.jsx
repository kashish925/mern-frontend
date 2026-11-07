import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import Logo from '../ui/Logo.jsx'
import ThemeToggle from '../ui/ThemeToggle.jsx'

const LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#how', label: 'How it works' },
  { href: '/#reviews', label: 'Reviews' },
  { to: '/pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' }
]

export default function PublicNav() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-3 z-40 px-3 sm:top-4 sm:px-6">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full py-2 pl-4 pr-2" aria-label="Main">
        <Logo size="sm" />
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              {link.to ? (
                <Link to={link.to} className="rounded-full px-4 py-2 text-sm font-bold text-ink-muted transition hover:bg-surface/70 hover:text-ink">
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} className="rounded-full px-4 py-2 text-sm font-bold text-ink-muted transition hover:bg-surface/70 hover:text-ink">
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? null : (
            <>
              <Button to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button to="/signup" size="sm">
                Start free trial
              </Button>
            </>
          )}
        </div>
        <ThemeToggle className="ml-auto md:hidden" />
        <button
          type="button"
          className="rounded-full p-2 text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <Icon name={open ? 'x' : 'menu'} />
        </button>
      </nav>
      {open ? (
        <div id="mobile-menu" className="glass mx-auto mt-2 max-w-6xl animate-fadeup rounded-3xl p-3 md:hidden">
          {LINKS.map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 font-bold text-ink">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 font-bold text-ink">
                {link.label}
              </a>
            )
          )}
          {user ? null : (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button to="/login" variant="secondary">
                Log in
              </Button>
              <Button to="/signup">Start free</Button>
            </div>
          )}
        </div>
      ) : null}
    </header>
  )
}
