import Logo from './Logo.jsx'

export default function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" aria-busy="true" aria-label="Loading">
      <Logo variant="mark" size="lg" to={null} className="animate-floaty" />
    </div>
  )
}
