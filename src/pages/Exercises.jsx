import { Link } from 'react-router-dom'
import { exercisesApi } from '../api/exercises.js'
import Alert from '../components/ui/Alert.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import { SkeletonCard } from '../components/ui/Skeleton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { minutes } from '../utils/format.js'

const CATEGORY = {
  breathing: { label: 'Breathing', icon: 'wind' },
  grounding: { label: 'Grounding', icon: 'leaf' },
  meditation: { label: 'Meditation', icon: 'sun' },
  movement: { label: 'Movement', icon: 'heart' },
  sleep: { label: 'Sleep', icon: 'moon' },
  relaxation: { label: 'Relaxation', icon: 'leaf' },
  mindfulness: { label: 'Mindfulness', icon: 'sparkle' }
}

export default function Exercises() {
  useDocumentTitle('Exercises')
  const { access } = useAuth()
  const list = useAsync(() => exercisesApi.list(), [])
  const exercises = list.data?.exercises || []

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Exercises</h1>
        <p className="mt-1 text-ink-muted">A few calm minutes, whenever you need them.</p>
      </header>

      {!access?.premiumExercises ? (
        <Alert tone="info" title="Two breathing exercises are free" action={<Button to="/pricing" size="sm">Unlock all</Button>}>
          Box breathing and 4-7-8 breathing are always free. A paid plan unlocks the full library: grounding, meditation, relaxation, movement and sleep routines.
        </Alert>
      ) : null}

      {list.error ? <Alert tone="danger" title={list.error.message} action={<Button size="sm" variant="secondary" onClick={list.reload}>Try again</Button>} /> : null}

      {list.loading && !list.data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((ex) => {
            const locked = ex.premium && !access?.premiumExercises
            const cat = CATEGORY[ex.category] || CATEGORY.breathing
            return (
              <li key={ex.id}>
                <Link to={`/exercises/${ex.id}`} className="card group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-primary transition group-hover:bg-brand group-hover:text-white">
                      <Icon name={cat.icon} />
                    </span>
                    {locked ? (
                      <Badge tone="neutral">
                        <Icon name="lock" size={12} /> Plan
                      </Badge>
                    ) : ex.premium ? (
                      <Badge>Premium</Badge>
                    ) : (
                      <Badge tone="success">Free</Badge>
                    )}
                  </div>
                  <h2 className="mt-4 text-lg font-extrabold">{ex.name}</h2>
                  <p className="mt-1 flex-1 text-sm text-ink-muted">{ex.description}</p>
                  <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-ink-faint">
                    <Icon name="clock" size={16} /> {minutes(ex.defaultDurationSec)} · {cat.label}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
