import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { accountApi } from '../api/account.js'
import { track } from '../analytics/track.js'
import { authApi } from '../api/auth.js'
import { billingApi } from '../api/billing.js'
import { onboardingApi } from '../api/onboarding.js'
import ChoiceGrid from '../components/feature/ChoiceGrid.jsx'
import { LevelPicker } from '../components/feature/MoodPicker.jsx'
import PasswordCodeForm from '../components/feature/PasswordCodeForm.jsx'
import Alert from '../components/ui/Alert.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card, { CardHeader } from '../components/ui/Card.jsx'
import Icon from '../components/ui/Icon.jsx'
import Modal from '../components/ui/Modal.jsx'
import { SkeletonCard } from '../components/ui/Skeleton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { longDate, timeLeft } from '../utils/dates.js'
import { AGE_RANGES, CHECKIN_QUESTIONS, CONCERNS, GOALS, PLANS } from '../utils/format.js'

function Row({ label, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-3 last:border-0">
      <span className="text-sm font-bold text-ink-muted">{label}</span>
      <span className="text-sm font-extrabold text-ink">{children}</span>
    </div>
  )
}

function ProfileCard() {
  const { user } = useAuth()
  return (
    <Card>
      <CardHeader title="Profile" subtitle="Your account details" icon={<Icon name="user" />} />
      <Row label="Name">{user?.name}</Row>
      <Row label="Email">{user?.email}</Row>
      <Row label="Member since">{user?.createdAt ? longDate(user.createdAt) : '–'}</Row>
    </Card>
  )
}

function PasswordCard() {
  const toast = useToast()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [devOtp, setDevOtp] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const requestCode = async () => {
    const result = await authApi.requestPasswordCode()
    track('password_code_requested', { context: 'settings' })
    if (result.devOtp) setDevOtp(result.devOtp)
    return result
  }

  const start = async () => {
    setError('')
    setSending(true)
    try {
      await requestCode()
      setOpen(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Password" subtitle="We’ll email you a code to confirm it’s you" icon={<Icon name="lock" />} />
      {open ? (
        <div className="space-y-3">
          <PasswordCodeForm
            email={user?.email}
            devOtp={devOtp}
            onResend={requestCode}
            submitLabel="Change password"
            onSubmit={async ({ otp, password }) => {
              await authApi.changePassword({ otp, password })
              track('password_changed', { context: 'settings' })
              toast.success('Your password was changed')
              setOpen(false)
              setDevOtp('')
            }}
          />
          <Button variant="ghost" className="w-full" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {error ? <Alert tone="danger" title={error} /> : null}
          <Button variant="secondary" onClick={start} loading={sending}>
            <Icon name="lock" size={16} /> Change password
          </Button>
        </div>
      )}
    </Card>
  )
}

function AnswersCard({ profile, onChanged }) {
  const toast = useToast()
  const { refresh } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    if (profile)
      setForm({
        reminderTime: profile.reminderTime || '',
        ageRange: profile.ageRange || '',
        concerns: profile.concerns || [],
        goals: profile.goals || [],
        checkinScores: profile.checkinScores || {},
        talkedToProfessional: profile.talkedToProfessional
      })
  }, [profile])

  if (!form) return <SkeletonCard />

  const save = async () => {
    setError('')
    if (!form.ageRange || !form.concerns.length || !form.goals.length) {
      setError('Keep an age range and at least one concern and goal selected.')
      return
    }
    setSaving(true)
    try {
      const body = {
        reminderTime: form.reminderTime || null,
        ageRange: form.ageRange,
        concerns: form.concerns,
        goals: form.goals,
        talkedToProfessional: form.talkedToProfessional ?? null
      }
      if (CHECKIN_QUESTIONS.every((q) => form.checkinScores[q.key])) body.checkinScores = form.checkinScores
      await onboardingApi.update(body)
      toast.success('Your answers are saved')
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    setDeleting(true)
    try {
      await onboardingApi.remove()
      await refresh()
      toast.success('Your answers were deleted')
      navigate('/onboarding', { replace: true })
    } catch (err) {
      setError(err.message)
      setConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Your answers" subtitle="Used to personalise suggestions and the companion’s tone" icon={<Icon name="sparkle" />} />
      <div className="space-y-6">
        <label className="block space-y-1.5">
          <span className="block text-sm font-bold">Daily reminder time</span>
          <input type="time" className="field max-w-[200px]" value={form.reminderTime} onChange={(e) => setForm({ ...form, reminderTime: e.target.value })} />
        </label>
        <fieldset className="space-y-2">
          <legend className="text-sm font-bold">Age range</legend>
          <ChoiceGrid name="settings-age" options={AGE_RANGES} value={form.ageRange} onChange={(v) => setForm({ ...form, ageRange: v })} />
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-bold">What you’d like support with</legend>
          <ChoiceGrid name="settings-concerns" multiple options={CONCERNS} value={form.concerns} onChange={(v) => setForm({ ...form, concerns: v })} />
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-bold">Your goals</legend>
          <ChoiceGrid name="settings-goals" multiple options={GOALS} value={form.goals} onChange={(v) => setForm({ ...form, goals: v })} />
        </fieldset>
        <div className="space-y-4">
          <p className="text-sm font-bold">How the past two weeks have felt</p>
          {CHECKIN_QUESTIONS.map((q) => (
            <LevelPicker
              key={q.key}
              name={`settings-${q.key}`}
              label={q.text}
              value={form.checkinScores[q.key]}
              lowLabel={q.low}
              highLabel={q.high}
              onChange={(n) => setForm({ ...form, checkinScores: { ...form.checkinScores, [q.key]: n } })}
            />
          ))}
        </div>
        {error ? <Alert tone="danger" title={error} /> : null}
        <div className="flex flex-wrap justify-between gap-2">
          <Button variant="danger" onClick={() => setConfirm(true)}>
            <Icon name="trash" size={16} /> Delete my answers
          </Button>
          <Button onClick={save} loading={saving}>
            Save answers
          </Button>
        </div>
      </div>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Delete your answers?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Keep them
            </Button>
            <Button variant="danger" loading={deleting} onClick={remove}>
              Delete answers
            </Button>
          </>
        }
      >
        Your onboarding answers will be removed. You’ll be asked the questions again next time, and your trial dates stay the same.
      </Modal>
    </Card>
  )
}

function BillingCard() {
  const toast = useToast()
  const { refresh } = useAuth()
  const status = useAsync(() => billingApi.status(), [])
  const [confirm, setConfirm] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')
  const data = status.data
  const sub = data?.subscription
  const plan = PLANS.find((p) => p.id === sub?.plan)

  const cancel = async () => {
    setCancelling(true)
    setError('')
    try {
      await billingApi.cancel()
      toast.success('Your plan will end at the close of this billing period')
      await Promise.all([status.reload(), refresh()])
    } catch (err) {
      setError(err.status === 503 ? 'Payments aren’t set up yet, so cancelling isn’t available right now.' : err.message)
    } finally {
      setCancelling(false)
      setConfirm(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Billing" subtitle="Your plan and renewal" icon={<Icon name="crown" />} />
      {status.loading && !data ? (
        <SkeletonCard />
      ) : status.error ? (
        <Alert tone="danger" title={status.error.message} />
      ) : (
        <>
          <Row label="Plan">
            {sub?.status === 'active' && plan ? (
              <span className="inline-flex items-center gap-2">
                {plan.name} · ${plan.price}/{plan.period} <Badge tone="success">Active</Badge>
                {sub.testMode ? <Badge tone="warning">Test mode</Badge> : null}
              </span>
            ) : sub ? (
              <span className="inline-flex items-center gap-2 capitalize">
                {plan?.name || sub.plan} <Badge tone="warning">{sub.status.replace('_', ' ')}</Badge>
              </span>
            ) : data?.trialActive ? (
              <span className="inline-flex items-center gap-2">
                Free trial <Badge>{timeLeft(data.trialEndsAt)} left</Badge>
              </span>
            ) : (
              'No plan'
            )}
          </Row>
          {sub?.currentPeriodEnd ? (
            <Row label={sub.cancelAtPeriodEnd ? 'Access until' : 'Renews on'}>{longDate(sub.currentPeriodEnd)}</Row>
          ) : null}
          {data?.trialEndsAt && !sub ? <Row label={data.trialActive ? 'Trial ends' : 'Trial ended'}>{longDate(data.trialEndsAt)}</Row> : null}
          <Row label="Insights">{data?.insights ? 'Unlocked' : 'Locked (trial or plan)'}</Row>
          <Row label="AI companion">{data?.companion ? 'Unlocked' : 'Locked (paid plans)'}</Row>
          <Row label="Premium exercises">{data?.premiumExercises ? 'Unlocked' : 'Locked (paid plans)'}</Row>
          {error ? <Alert tone="danger" title={error} className="mt-4" /> : null}
          <div className="mt-5 flex flex-wrap gap-2">
            {sub?.status !== 'active' ? <Button to="/pricing">Choose a plan</Button> : null}
            {sub?.status === 'active' && !sub.cancelAtPeriodEnd && !sub.testMode ? (
              <Button variant="danger" onClick={() => setConfirm(true)}>
                Cancel plan
              </Button>
            ) : null}
          </div>
          <p className="mt-4 text-xs text-ink-faint">Payments are handled by Razorpay, which emails a receipt for each payment.</p>
        </>
      )}
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Cancel your plan?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Keep my plan
            </Button>
            <Button variant="danger" loading={cancelling} onClick={cancel}>
              Cancel plan
            </Button>
          </>
        }
      >
        You’ll keep full access until the end of your current billing period. Nothing you’ve written will be deleted.
      </Modal>
    </Card>
  )
}

function DataCard() {
  const { clear } = useAuth()
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState(false)
  const [typed, setTyped] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const deleteAccount = async () => {
    setDeleting(true)
    setError('')
    try {
      await accountApi.deleteAccount()
      clear()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
      setConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Your data" subtitle="Permanently delete everything" icon={<Icon name="shield" />} />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-danger/20 bg-blush-mist/60 p-4">
          <div>
            <p className="font-extrabold">Delete my account</p>
            <p className="text-sm text-ink-muted">Removes your account and everything in it. This can’t be undone.</p>
          </div>
          <Button variant="danger" onClick={() => setConfirm(true)}>
            <Icon name="trash" size={16} /> Delete account
          </Button>
        </div>
        {error ? <Alert tone="danger" title={error} /> : null}
      </div>
      <Modal
        open={confirm}
        onClose={() => {
          setConfirm(false)
          setTyped('')
        }}
        title="Delete your account?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} disabled={typed !== 'DELETE'} onClick={deleteAccount}>
              Delete everything
            </Button>
          </>
        }
      >
        <p>Your check-ins, journal, exercise history, chats and any active plan will be removed permanently.</p>
        <label className="mt-4 block space-y-1.5">
          <span className="font-bold text-ink">Type DELETE to confirm</span>
          <input className="field" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
        </label>
      </Modal>
    </Card>
  )
}

const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
]

function AppearanceCard() {
  const { theme, setTheme } = useTheme()
  return (
    <Card>
      <CardHeader title="Appearance" subtitle="Choose how HappiTrack looks on this device" icon={<Icon name="moon" />} />
      <fieldset>
        <legend className="sr-only">Theme</legend>
        <ChoiceGrid name="theme" options={THEME_OPTIONS} value={theme} onChange={setTheme} />
      </fieldset>
    </Card>
  )
}

export default function Settings() {
  useDocumentTitle('Settings')
  const onboarding = useAsync(() => onboardingApi.get(), [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Settings</h1>
        <p className="mt-1 text-ink-muted">Manage your profile, preferences, plan and data.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ProfileCard />
          <PasswordCard />
          <AppearanceCard />
          <BillingCard />
          <DataCard />
        </div>
        <AnswersCard profile={onboarding.data?.profile} onChanged={onboarding.reload} />
      </div>
    </div>
  )
}
