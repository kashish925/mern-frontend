import logoMark from '../../assets/logo-mark.png'

export default function EmptyState({ title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-lavender/50 bg-surface px-6 py-12 text-center">
      <img src={logoMark} alt="" className="mb-4 h-16 w-auto opacity-90 animate-floaty" />
      <h3 className="text-lg font-extrabold">{title}</h3>
      {text ? <p className="mt-1 max-w-sm text-sm text-ink-muted">{text}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
