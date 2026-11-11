import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import { Input, PasswordInput } from '../components/ui/Field.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import SEO from '../components/SEO.jsx'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Tell us what to call you.'
  if (!EMAIL.test(form.email.trim())) errors.email = 'Enter a valid email address.'
  if (form.password.length < 8) errors.password = 'Use at least 8 characters.'
  else if (new TextEncoder().encode(form.password).length > 72) errors.password = 'That password is too long.'
  return errors
}

export default function Signup() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return
    setLoading(true)
    try {
      await register(form.name.trim(), form.email.trim(), form.password)
      navigate('/onboarding', { replace: true })
    } catch (err) {
      if (err.status === 409) setErrors({ email: 'An account with this email already exists. Try logging in.' })
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <AuthLayout
      title="Begin gently"
      subtitle="Three days free. No card needed."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-extrabold text-primary underline-offset-2 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <SEO
        title="Start your free trial"
        description="Create your HappiTrack account and get 3 days free, no card needed. Track mood, sleep and stress, journal privately and try guided calming exercises."
        path="/signup"
      />
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        {error ? <Alert tone="danger" title={error} /> : null}
        <Input label="Your name" autoComplete="given-name" value={form.name} onChange={set('name')} error={errors.name} />
        <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          hint="At least 8 characters."
        />
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create my account
        </Button>
        <p className="text-center text-xs text-ink-muted">
          By continuing you agree to our <Link to="/terms" className="font-bold text-primary">Terms</Link> and{' '}
          <Link to="/privacy" className="font-bold text-primary">Privacy Policy</Link>.
        </p>
      </form>
    </AuthLayout>
  )
}
