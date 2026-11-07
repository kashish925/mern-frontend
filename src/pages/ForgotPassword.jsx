import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../api/auth.js'
import PasswordCodeForm from '../components/feature/PasswordCodeForm.jsx'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import { Input } from '../components/ui/Field.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function ForgotPassword() {
  useDocumentTitle('Reset your password')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('email')
  const [devOtp, setDevOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const requestCode = async () => {
    const result = await authApi.forgotPassword(email.trim())
    if (result.devOtp) setDevOtp(result.devOtp)
    return result
  }

  const onSubmitEmail = async (event) => {
    event.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Enter the email you signed up with.')
      return
    }
    setLoading(true)
    try {
      await requestCode()
      setStep('code')
    } catch (err) {
      setError(err.validationMessages?.[0] || err.message)
    } finally {
      setLoading(false)
    }
  }

  const subtitle =
    step === 'email' ? 'Enter your email and we’ll send you a 6-digit code.' : step === 'code' ? 'Enter the code and choose a new password.' : null

  return (
    <AuthLayout
      title={step === 'done' ? 'Password updated' : 'Forgot your password?'}
      subtitle={subtitle}
      footer={
        <Link to="/login" className="font-extrabold text-primary hover:underline">
          Back to log in
        </Link>
      }
    >
      {step === 'done' ? (
        <Alert tone="success" title="You’re all set" action={<Button to="/login" size="sm">Log in</Button>}>
          You can now log in with your new password.
        </Alert>
      ) : step === 'code' ? (
        <div className="space-y-4">
          <PasswordCodeForm
            email={email.trim()}
            devOtp={devOtp}
            onResend={requestCode}
            onSubmit={async ({ otp, password }) => {
              await authApi.resetPassword({ email: email.trim(), otp, password })
              setStep('done')
            }}
          />
          <button type="button" onClick={() => setStep('email')} className="w-full text-center text-sm font-bold text-ink-muted hover:text-ink">
            Use a different email
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={onSubmitEmail} noValidate>
          {error ? <Alert tone="danger" title={error} /> : null}
          <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Send code
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
