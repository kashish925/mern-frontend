import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'

export default function LockedCard({ title = 'Unlock with a plan', text, cta = 'See plans', to = '/pricing', compact = false }) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'gap-2 p-4' : 'gap-3 p-8'}`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-soft">
        <Icon name="lock" />
      </span>
      <h2 className="text-lg font-extrabold">{title}</h2>
      {text ? <p className="max-w-sm text-sm text-ink-muted">{text}</p> : null}
      <Button to={to} size="sm" className="mt-1">
        {cta}
      </Button>
    </div>
  )
}
