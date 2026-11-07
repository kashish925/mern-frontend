import Icon from './Icon.jsx'

const TONES = {
  info: { box: 'border-lavender/40 bg-lavender-mist text-ink', icon: 'info', iconClass: 'text-primary' },
  success: { box: 'border-success/30 bg-success/5 text-ink', icon: 'check', iconClass: 'text-success' },
  warning: { box: 'border-warning/30 bg-warning/5 text-ink', icon: 'alert', iconClass: 'text-warning' },
  danger: { box: 'border-danger/30 bg-blush-mist text-ink', icon: 'alert', iconClass: 'text-danger' }
}

export default function Alert({ tone = 'info', title, children, action, className = '' }) {
  const t = TONES[tone]
  return (
    <div className={`flex gap-3 rounded-2xl border p-4 ${t.box} ${className}`} role={tone === 'danger' ? 'alert' : 'status'}>
      <Icon name={t.icon} className={`mt-0.5 shrink-0 ${t.iconClass}`} />
      <div className="min-w-0 flex-1 text-sm">
        {title ? <p className="font-extrabold">{title}</p> : null}
        {children ? <div className="text-ink-muted">{children}</div> : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  )
}
