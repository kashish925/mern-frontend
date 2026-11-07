import { Link } from 'react-router-dom'
import Spinner from './Spinner.jsx'

const VARIANTS = {
  primary: 'bg-brand text-white shadow-soft hover:shadow-lift hover:brightness-105',
  solid: 'bg-primary text-white shadow-soft hover:bg-primary-dark',
  secondary: 'border border-line bg-surface text-ink hover:border-lavender hover:bg-lavender-mist',
  ghost: 'text-ink-muted hover:bg-lavender-mist hover:text-ink',
  glass: 'glass text-ink hover:bg-surface/90',
  danger: 'border border-danger/30 bg-surface text-danger hover:bg-danger/5'
}

const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-[15px] gap-2',
  lg: 'h-12 px-7 text-base gap-2'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  loading = false,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const classes = `inline-flex items-center justify-center rounded-full font-bold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`
  const inner = (
    <>
      {loading ? <Spinner className="h-4 w-4" /> : null}
      {children}
    </>
  )
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {inner}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {inner}
    </button>
  )
}
