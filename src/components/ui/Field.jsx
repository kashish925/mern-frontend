import { useId, useState } from 'react'
import Icon from './Icon.jsx'

export function Field({ label, hint, error, children, id, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-bold text-ink">
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-semibold text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ label, hint, error, className = '', id: givenId, ...rest }) {
  const autoId = useId()
  const id = givenId || autoId
  return (
    <Field label={label} hint={hint} error={error} id={id} className={className}>
      <input
        id={id}
        className={`field ${error ? 'border-danger/50' : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...rest}
      />
    </Field>
  )
}

export function PasswordInput({ label, hint, error, className = '', id: givenId, ...rest }) {
  const autoId = useId()
  const id = givenId || autoId
  const [visible, setVisible] = useState(false)
  return (
    <Field label={label} hint={hint} error={error} id={id} className={className}>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={`field pr-12 ${error ? 'border-danger/50' : ''}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-ink-muted transition hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lavender/30"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          aria-controls={id}
        >
          <Icon name={visible ? 'eye' : 'eyeOff'} size={20} />
        </button>
      </div>
    </Field>
  )
}

export function Textarea({ label, hint, error, className = '', id: givenId, ...rest }) {
  const autoId = useId()
  const id = givenId || autoId
  return (
    <Field label={label} hint={hint} error={error} id={id} className={className}>
      <textarea
        id={id}
        className={`field min-h-[120px] resize-y leading-relaxed ${error ? 'border-danger/50' : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...rest}
      />
    </Field>
  )
}

export function Select({ label, hint, error, className = '', id: givenId, children, ...rest }) {
  const autoId = useId()
  const id = givenId || autoId
  return (
    <Field label={label} hint={hint} error={error} id={id} className={className}>
      <select id={id} className="field appearance-none bg-surface pr-10" {...rest}>
        {children}
      </select>
    </Field>
  )
}
