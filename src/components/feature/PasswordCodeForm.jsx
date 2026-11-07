import { useEffect, useState } from 'react'
import Alert from '../ui/Alert.jsx'
import Button from '../ui/Button.jsx'
import { Input, PasswordInput } from '../ui/Field.jsx'

const RESEND_SECONDS = 60

export default function PasswordCodeForm({ email, devOtp, onSubmit, onResend, submitLabel = 'Save new password' }) {
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [wait, setWait] = useState(RESEND_SECONDS)

  useEffect(() => {
    if (wait <= 0) return undefined
    const t = setTimeout(() => setWait((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit code from your email.')
    if (password.length < 8) return setError('Use at least 8 characters for your new password.')
    if (password !== confirm) return setError('The two passwords don’t match.')
    setLoading(true)
    try {
      await onSubmit({ otp, password })
    } catch (err) {
      setError(err.validationMessages?.[0] || err.message)
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    setError('')
    setNotice('')
    setResending(true)
    try {
      const result = await onResend()
      setNotice(result?.message || 'We sent a new code.')
      setOtp('')
      setWait(RESEND_SECONDS)
    } catch (err) {
      setError(err.message)
    } finally {
      setResending(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit} noValidate>
      <p className="text-sm text-ink-muted">
        We sent a 6-digit code to <span className="font-extrabold text-ink">{email}</span>. It expires in 10 minutes.
      </p>
      {devOtp ? (
        <Alert tone="info" title="Development mode">
          No email service is set up yet, so here is your code: <span className="font-extrabold tracking-widest text-ink">{devOtp}</span>
        </Alert>
      ) : null}
      {notice ? <Alert tone="success" title={notice} /> : null}
      {error ? <Alert tone="danger" title={error} /> : null}
      <Input
        label="6-digit code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        className="[&_input]:text-center [&_input]:text-2xl [&_input]:font-extrabold [&_input]:tracking-[0.5em]"
        placeholder="••••••"
      />
      <PasswordInput label="New password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} hint="At least 8 characters." />
      <PasswordInput label="Confirm new password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      <Button type="submit" className="w-full" size="lg" loading={loading}>
        {submitLabel}
      </Button>
      <p className="text-center text-sm text-ink-muted">
        Didn’t get it?{' '}
        <button
          type="button"
          onClick={resend}
          disabled={wait > 0 || resending}
          className="font-extrabold text-primary hover:underline disabled:cursor-not-allowed disabled:text-ink-faint disabled:no-underline"
        >
          {wait > 0 ? `Resend code in ${wait}s` : resending ? 'Sending…' : 'Resend code'}
        </button>
      </p>
    </form>
  )
}
