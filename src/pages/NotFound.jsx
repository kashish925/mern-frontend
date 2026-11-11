import heroSky from '../assets/hero-sky.jpg'
import SEO from '../components/SEO.jsx'
import Button from '../components/ui/Button.jsx'
import Logo from '../components/ui/Logo.jsx'

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <SEO title="Page not found" description="This page could not be found on HappiTrack." noindex />
      <img src={heroSky} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="glass relative max-w-md rounded-3xl p-10 text-center">
        <Logo variant="full" className="mx-auto !w-40" />
        <h1 className="mt-6 font-display text-4xl font-semibold">Lost in the clouds</h1>
        <p className="mt-2 text-ink-muted">We couldn’t find that page. Let’s get you somewhere calm.</p>
        <Button to="/" className="mt-6">
          Back to home
        </Button>
      </div>
    </main>
  )
}
