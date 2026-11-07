import { Link } from 'react-router-dom'
import Logo from '../ui/Logo.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo size="sm" />
          <p className="max-w-sm text-sm text-ink-muted">
            A calm, private space to check in with yourself, journal, breathe, and notice what helps.
          </p>
          <p className="max-w-sm text-xs text-ink-faint">
            HappiTrack is a wellness tool, not medical care. If you are in danger, contact your local emergency number.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-extrabold">Product</h2>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><a href="/#features" className="hover:text-primary">Features</a></li>
            <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
            <li><a href="/#faq" className="hover:text-primary">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-extrabold">Legal</h2>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Terms of Use</Link></li>
            <li><Link to="/disclaimer" className="hover:text-primary">Medical disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line py-5 text-center text-xs text-ink-faint">© {new Date().getFullYear()} HappiTrack</p>
    </footer>
  )
}
