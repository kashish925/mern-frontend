import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import { Input, PasswordInput } from '../components/ui/Field.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function Login() {
  useDocumentTitle('Log in')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.email.trim() || !form.password) {
      setError('Enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const session = await login(form.email.trim(), form.password)
      const from = location.state?.from
      navigate(session.onboardingCompleted ? from || '/dashboard' : '/onboarding', { replace: true })
    } catch (err) {
      setError(err.status === 401 ? 'That email and password don’t match an account.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Take a breath. Let’s pick up where you left off."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-extrabold text-primary underline-offset-2 hover:underline">
            Start your free trial
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        {error ? <Alert tone="danger" title={error} /> : null}
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-bold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Log in
        </Button>
      </form>
    </AuthLayout>
  )
}
