import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { track } from '../analytics/track.js'
import { exercisesApi } from '../api/exercises.js'
import BreathingCircle from '../components/feature/BreathingCircle.jsx'
import LockedCard from '../components/feature/LockedCard.jsx'
import TimerRing from '../components/feature/TimerRing.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Icon from '../components/ui/Icon.jsx'
import { SkeletonCard } from '../components/ui/Skeleton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { BREATHING, STEPS, playerKind } from '../utils/exerciseGuides.js'
import { clock, minutes } from '../utils/format.js'

function useElapsed(running) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  return [elapsed, setElapsed]
}

function BreathingPlayer({ exercise, onComplete }) {
  const [running, setRunning] = useState(false)
  const [elapsed] = useElapsed(running)
  const target = exercise.defaultDurationSec
  useEffect(() => {
    if (elapsed >= target) {
      setRunning(false)
      onComplete(elapsed)
    }
  }, [elapsed, target, onComplete])
  return (
    <div className="flex flex-col items-center gap-6">
      <BreathingCircle pattern={BREATHING[exercise.id]} running={running} />
      <p className="text-sm font-bold text-ink-muted">
        {clock(elapsed)} of {clock(target)}
      </p>
      <Controls running={running} onToggle={() => setRunning((r) => !r)} onFinish={elapsed > 0 ? () => { setRunning(false); onComplete(elapsed) } : null} />
    </div>
  )
}

function TimerPlayer({ exercise, onComplete }) {
  const total = exercise.defaultDurationSec
  const [running, setRunning] = useState(false)
  const [elapsed] = useElapsed(running)
  const remaining = Math.max(0, total - elapsed)
  useEffect(() => {
    if (elapsed >= total) {
      setRunning(false)
      onComplete(total)
    }
  }, [elapsed, total, onComplete])
  return (
    <div className="flex flex-col items-center gap-6">
      <TimerRing total={total} remaining={remaining} label={running ? 'Breathe naturally' : 'Find a comfortable seat'} />
      <Controls running={running} onToggle={() => setRunning((r) => !r)} onFinish={elapsed > 0 ? () => { setRunning(false); onComplete(elapsed) } : null} />
    </div>
  )
}

function StepsPlayer({ exercise, onComplete }) {
  const steps = STEPS[exercise.id]
  const [index, setIndex] = useState(0)
  const [running, setRunning] = useState(false)
  const [elapsed] = useElapsed(running)
  const stepStart = useRef(0)
  const step = steps[index]
  const stepRemaining = Math.max(0, step.seconds - (elapsed - stepStart.current))

  const goTo = (i) => {
    stepStart.current = elapsed
    setIndex(i)
  }

  useEffect(() => {
    if (running && stepRemaining === 0) {
      if (index < steps.length - 1) {
        stepStart.current = elapsed
        setIndex(index + 1)
      } else {
        setRunning(false)
        onComplete(elapsed)
      }
    }
  }, [running, stepRemaining, index, steps.length, elapsed, onComplete])

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <ol className="flex gap-1.5" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s.title} className={`h-1.5 flex-1 rounded-full ${i <= index ? 'bg-brand' : 'bg-lavender-light'}`}>
            <span className="sr-only">{s.title}</span>
          </li>
        ))}
      </ol>
      <div key={index} className="glass animate-fadeup rounded-3xl p-8 text-center">
        <p className="text-xs font-extrabold uppercase tracking-wider text-blush">
          Step {index + 1} of {steps.length}
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold">{step.title}</h2>
        <p className="mt-3 leading-relaxed text-ink-muted">{step.text}</p>
        <p className="mt-6 font-display text-5xl font-semibold text-primary" aria-live="polite">
          {clock(stepRemaining)}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="secondary" onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0}>
          <Icon name="arrowLeft" size={16} /> Back
        </Button>
        <Button onClick={() => setRunning((r) => !r)}>
          <Icon name={running ? 'pause' : 'play'} size={16} /> {running ? 'Pause' : elapsed ? 'Resume' : 'Start'}
        </Button>
        {index < steps.length - 1 ? (
          <Button variant="secondary" onClick={() => goTo(index + 1)}>
            Next <Icon name="arrowRight" size={16} />
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => { setRunning(false); onComplete(Math.max(elapsed, 1)) }}>
            <Icon name="check" size={16} /> Finish
          </Button>
        )}
      </div>
    </div>
  )
}

function Controls({ running, onToggle, onFinish }) {
  return (
    <div className="flex gap-2">
      <Button size="lg" onClick={onToggle}>
        <Icon name={running ? 'pause' : 'play'} size={18} /> {running ? 'Pause' : 'Start'}
      </Button>
      {onFinish ? (
        <Button size="lg" variant="secondary" onClick={onFinish}>
          <Icon name="check" size={18} /> Finish
        </Button>
      ) : null}
    </div>
  )
}

export default function ExercisePlayer() {
  const { id } = useParams()
  const { access } = useAuth()
  const list = useAsync(() => exercisesApi.list(), [])
  const exercise = list.data?.exercises?.find((e) => e.id === id)
  useDocumentTitle(exercise?.name || 'Exercise')
  const [done, setDone] = useState(null)
  const [saveError, setSaveError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const completingRef = useRef(false)

  const onComplete = async (seconds) => {
    if (completingRef.current) return
    completingRef.current = true
    setSaveError('')
    try {
      const { session } = await exercisesApi.logSession(exercise.id, Math.min(7200, Math.max(1, Math.round(seconds))))
      track('exercise_completed', { exercise_id: exercise.id, duration_sec: session?.durationSec })
      setDone(session)
    } catch (err) {
      setSaveError(err.message)
      completingRef.current = false
    }
  }

  if (list.loading && !list.data) return <SkeletonCard />
  if (!exercise) {
    return <Alert tone="warning" title="We couldn’t find that exercise" action={<Button to="/exercises" size="sm">All exercises</Button>} />
  }

  const locked = exercise.premium && !access?.premiumExercises
  const kind = playerKind(exercise)

  return (
    <div className="space-y-6">
      <Button to="/exercises" variant="ghost" size="sm">
        <Icon name="arrowLeft" size={16} /> Exercises
      </Button>
      <header className="text-center">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{exercise.name}</h1>
        <p className="mx-auto mt-2 max-w-xl text-ink-muted">{exercise.description}</p>
        <p className="mt-1 text-sm font-bold text-ink-faint">About {minutes(exercise.defaultDurationSec)}</p>
      </header>

      {locked ? (
        <Card className="mx-auto max-w-lg">
          <LockedCard title="This exercise is on paid plans" text="Box breathing and 4-7-8 breathing are always free. Choose a paid plan to unlock the full library." />
        </Card>
      ) : done ? (
        <Card className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white">
            <Icon name="check" size={28} />
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold">Well done</h2>
          <p className="mt-2 text-ink-muted">You spent {clock(done.durationSec)} looking after yourself. It’s saved to your history.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                completingRef.current = false
                setDone(null)
                setAttempt((a) => a + 1)
              }}
            >
              Do it again
            </Button>
            <Button to="/dashboard">Back home</Button>
          </div>
        </Card>
      ) : (
        <Card className="py-10">
          {saveError ? <Alert tone="danger" title={saveError} className="mx-auto mb-6 max-w-lg" /> : null}
          {kind === 'breathing' ? <BreathingPlayer key={attempt} exercise={exercise} onComplete={onComplete} /> : null}
          {kind === 'steps' ? <StepsPlayer key={attempt} exercise={exercise} onComplete={onComplete} /> : null}
          {kind === 'timer' ? <TimerPlayer key={attempt} exercise={exercise} onComplete={onComplete} /> : null}
        </Card>
      )}
    </div>
  )
}
