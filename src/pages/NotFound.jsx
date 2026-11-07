import heroSky from '../assets/hero-sky.jpg'
import Button from '../components/ui/Button.jsx'
import Logo from '../components/ui/Logo.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <img src={heroSky} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="glass relative max-w-md rounded-3xl p-10 text-center">
        <Logo variant="full" className="mx-auto !w-40" />
        <h1 className="mt-6 font-display text-4xl font-semibold">Lost in the clouds</h1>
        <p className="mt-2 text-ink-muted">We couldn’t find that page. Let’s get you somewhere calm.</p>
        <Button to="/" className="mt-6">
          Back to home
        </Button>
      </div>
    </div>
  )
}
