import { HELPLINES } from '../../utils/helplines.js'
import Icon from '../ui/Icon.jsx'

export default function CrisisBanner({ className = '' }) {
  return (
    <div className={`rounded-2xl border-2 border-blush bg-blush-mist p-4 ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blush text-white">
          <Icon name="heart" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-ink">You don’t have to go through this alone.</p>
          <p className="text-sm text-ink-muted">Please reach out to someone who can help right now.</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {HELPLINES.map((line) => (
              <li key={line.name} className="rounded-xl bg-surface px-3 py-2 text-sm">
                <p className="font-bold text-ink">{line.name}</p>
                {line.tel ? (
                  <a href={`tel:${line.tel}`} className="inline-flex items-center gap-1 font-bold text-primary">
                    <Icon name="phone" size={14} /> {line.detail}
                  </a>
                ) : line.href ? (
                  <a href={line.href} target="_blank" rel="noreferrer" className="font-bold text-primary underline">
                    {line.detail}
                  </a>
                ) : (
                  <p className="text-ink-muted">{line.detail}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
