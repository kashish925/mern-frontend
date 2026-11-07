const TONES = {
  lavender: 'bg-lavender-light text-primary',
  blush: 'bg-blush-mist text-danger',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  neutral: 'bg-surface-muted text-ink-muted border border-line'
}

export default function Badge({ tone = 'lavender', className = '', children }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${TONES[tone]} ${className}`}>
      {children}
    </span>
  )
}
