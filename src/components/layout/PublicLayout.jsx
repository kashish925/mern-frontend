import Footer from './Footer.jsx'
import PublicNav from './PublicNav.jsx'

export default function PublicLayout({ children, plain = false }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      {plain ? (
        <div className="bg-brand-soft pb-2 pt-1">
          <PublicNav />
        </div>
      ) : (
        <PublicNav />
      )}
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
