export default function Card({ as: Tag = 'section', className = '', glass = false, children, ...rest }) {
  return (
    <Tag className={`${glass ? 'glass rounded-2xl' : 'card'} p-5 sm:p-6 ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

export function CardHeader({ title, subtitle, action, icon }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {icon ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
            {icon}
          </span>
        ) : null}
        <div>
          <h2 className="text-lg font-extrabold">{title}</h2>
          {subtitle ? <p className="text-sm text-ink-muted">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  )
}
