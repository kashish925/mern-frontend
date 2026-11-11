import SEO from '../components/SEO.jsx'
import PublicLayout from '../components/layout/PublicLayout.jsx'

export default function LegalPage({ title, updated, sections, path, description }) {
  return (
    <PublicLayout plain>
      <SEO title={title} description={description} path={path} />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated {updated}</p>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading} className="card p-6">
              <h2 className="text-lg font-extrabold">{section.heading}</h2>
              <div className="mt-2 space-y-2 leading-relaxed text-ink-muted">
                {section.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </PublicLayout>
  )
}
