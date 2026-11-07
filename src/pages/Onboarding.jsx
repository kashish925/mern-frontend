import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { onboardingApi } from '../api/onboarding.js'
import ChoiceGrid from '../components/feature/ChoiceGrid.jsx'
import ScaleQuestion from '../components/feature/ScaleQuestion.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import Logo from '../components/ui/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { AGE_RANGES, CHECKIN_QUESTIONS, CONCERNS, GOALS } from '../utils/format.js'

const EMPTY = {
  consent: false,
  ageRange: '',
  concerns: [],
  checkinScores: {},
  goals: [],
  reminderTime: '',
  talkedToProfessional: null
}

function buildSteps() {
  return [
    { id: 'consent' },
    { id: 'age' },
    { id: 'concerns' },
    ...CHECKIN_QUESTIONS.map((q) => ({ id: `score-${q.key}`, question: q })),
    { id: 'goals' },
    { id: 'preferences', optional: true }
  ]
}

export default function Onboarding() {
  useDocumentTitle('Welcome')
  const { user, onboardingCompleted, refresh } = useAuth()
  const navigate = useNavigate()
  const steps = useMemo(buildSteps, [])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    onboardingApi
      .get()
      .then((data) => {
        const p = data?.profile
        if (!p) return
        setAnswers({
          consent: Boolean(p.consentAcceptedAt),
          ageRange: p.ageRange || '',
          concerns: p.concerns || [],
          checkinScores: p.checkinScores || {},
          goals: p.goals || [],
          reminderTime: p.reminderTime || '',
          talkedToProfessional: p.talkedToProfessional ?? null
        })
      })
      .catch(() => {})
  }, [])

  if (onboardingCompleted && !result) return <Navigate to="/dashboard" replace />

  const step = steps[index]
  const progress = Math.round(((index + 1) / steps.length) * 100)
  const set = (patch) => setAnswers((a) => ({ ...a, ...patch }))

  const canContinue = (() => {
    if (step.id === 'consent') return answers.consent
    if (step.id === 'age') return Boolean(answers.ageRange)
    if (step.id === 'concerns') return answers.concerns.length > 0
    if (step.question) return Boolean(answers.checkinScores[step.question.key])
    if (step.id === 'goals') return answers.goals.length > 0
    return true
  })()

  const submit = async (skipPreferences = false) => {
    setSaving(true)
    setError('')
    try {
      const payload = {
        consent: true,
        ageRange: answers.ageRange,
        concerns: answers.concerns,
        checkinScores: answers.checkinScores,
        goals: answers.goals
      }
      if (!skipPreferences) {
        payload.reminderTime = answers.reminderTime || null
        payload.talkedToProfessional = answers.talkedToProfessional
      }
      const data = await onboardingApi.save(payload)
      const showSummary = !data.profile?.trialGranted
      if (showSummary) setResult(data)
      await refresh()
      if (!showSummary) navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const next = () => {
    if (!canContinue) return
    if (index < steps.length - 1) setIndex(index + 1)
    else submit(false)
  }

  if (result) {
    return (
      <Shell progress={100}>
        <div className="space-y-6">
          <h1 className="font-display text-3xl font-semibold">You’re all set, {user?.name?.split(' ')[0]}</h1>
          <Alert tone="info" title="This email has already used its free trial">
            You can still check in and read your history. Choose a plan any time to unlock everything.
          </Alert>
          <Button size="lg" onClick={() => navigate('/dashboard', { replace: true })}>
            Go to my dashboard <Icon name="arrowRight" size={18} />
          </Button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell progress={progress} stepLabel={`Step ${index + 1} of ${steps.length}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          next()
        }}
        className="animate-fadeup"
        key={step.id}
      >
        {step.id === 'consent' ? (
          <div className="space-y-5">
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">Welcome to HappiTrack, {user?.name?.split(' ')[0]}</h1>
            <p className="leading-relaxed text-ink-muted">
              A few quick questions help us personalise your space. Your answers are encrypted, only used to tailor HappiTrack for you,
              and you can edit or delete them any time in Settings.
            </p>
            <Alert tone="info" title="HappiTrack is a wellness tool, not medical care">
              It can’t diagnose or treat anything. If you’re in danger, please contact your local emergency number.
            </Alert>
            <label className="option-focus flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-line bg-surface p-4 font-semibold has-[:checked]:border-primary has-[:checked]:bg-brand-soft">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-primary"
                checked={answers.consent}
                onChange={(e) => set({ consent: e.target.checked })}
              />
              <span>I understand HappiTrack is not medical care, and I agree to how my data is used as described in the Privacy Policy.</span>
            </label>
          </div>
        ) : null}

        {step.id === 'age' ? (
          <fieldset className="space-y-5">
            <legend className="font-display text-3xl font-semibold">What’s your age range?</legend>
            <p className="text-sm text-ink-muted">Everyone is welcome. This only helps us keep the tone right for you.</p>
            <ChoiceGrid name="ageRange" options={AGE_RANGES} value={answers.ageRange} onChange={(v) => set({ ageRange: v })} />
          </fieldset>
        ) : null}

        {step.id === 'concerns' ? (
          <fieldset className="space-y-5">
            <legend className="font-display text-3xl font-semibold">What would you like support with?</legend>
            <p className="text-sm text-ink-muted">Choose as many as you like.</p>
            <ChoiceGrid name="concerns" multiple options={CONCERNS} value={answers.concerns} onChange={(v) => set({ concerns: v })} />
          </fieldset>
        ) : null}

        {step.question ? (
          <ScaleQuestion
            question={step.question}
            value={answers.checkinScores[step.question.key]}
            onChange={(n) => set({ checkinScores: { ...answers.checkinScores, [step.question.key]: n } })}
          />
        ) : null}

        {step.id === 'goals' ? (
          <fieldset className="space-y-5">
            <legend className="font-display text-3xl font-semibold">What are you hoping for?</legend>
            <p className="text-sm text-ink-muted">Pick the goals that matter to you.</p>
            <ChoiceGrid name="goals" multiple options={GOALS} value={answers.goals} onChange={(v) => set({ goals: v })} />
          </fieldset>
        ) : null}

        {step.id === 'preferences' ? (
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-semibold">A couple of preferences</h2>
            <label className="block space-y-1.5">
              <span className="block text-sm font-bold">When would you like a gentle check-in reminder?</span>
              <input
                type="time"
                className="field max-w-[200px]"
                value={answers.reminderTime}
                onChange={(e) => set({ reminderTime: e.target.value })}
              />
            </label>
            <fieldset className="space-y-2">
              <legend className="text-sm font-bold">Have you talked to a professional about how you feel? (optional)</legend>
              <ChoiceGrid
                name="talkedToProfessional"
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'Not yet' }
                ]}
                value={answers.talkedToProfessional === null ? '' : answers.talkedToProfessional ? 'yes' : 'no'}
                onChange={(v) => set({ talkedToProfessional: v === 'yes' })}
              />
            </fieldset>
          </div>
        ) : null}

        {error ? <Alert tone="danger" title={error} className="mt-6" /> : null}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0 || saving}>
            <Icon name="arrowLeft" size={18} /> Back
          </Button>
          <div className="flex gap-2">
            {step.optional ? (
              <Button variant="secondary" onClick={() => submit(true)} disabled={saving}>
                Skip
              </Button>
            ) : null}
            <Button type="submit" disabled={!canContinue} loading={saving}>
              {index === steps.length - 1 ? 'Finish' : 'Continue'}
              {index === steps.length - 1 ? null : <Icon name="arrowRight" size={18} />}
            </Button>
          </div>
        </div>
      </form>
    </Shell>
  )
}

function Shell({ progress, stepLabel, children }) {
  return (
    <div className="min-h-screen bg-brand-soft">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-5 pt-6">
        <Logo size="sm" to={null} />
        {stepLabel ? <span className="text-sm font-bold text-ink-muted">{stepLabel}</span> : null}
      </header>
      <div className="mx-auto max-w-2xl px-5 pt-5">
        <div className="h-2 overflow-hidden rounded-full bg-surface/70" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Onboarding progress">
          <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <main className="mx-auto max-w-2xl px-5 py-8">
        <div className="glass rounded-3xl p-6 sm:p-9">{children}</div>
      </main>
    </div>
  )
}
