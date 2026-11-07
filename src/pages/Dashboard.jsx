import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { checkinsApi } from '../api/checkins.js'
import { exercisesApi } from '../api/exercises.js'
import { onboardingApi } from '../api/onboarding.js'
import { TrendChart } from '../components/feature/Charts.jsx'
import CheckInCard from '../components/feature/CheckInCard.jsx'
import LockedCard from '../components/feature/LockedCard.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card, { CardHeader } from '../components/ui/Card.jsx'
import Icon from '../components/ui/Icon.jsx'
import { SkeletonCard } from '../components/ui/Skeleton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useTheme } from '../context/ThemeContext.jsx'
import { greeting, lastNDays, localDate, longDate, shiftDate } from '../utils/dates.js'
import { minutes, moodEmoji } from '../utils/format.js'
import { suggestExercise } from '../utils/suggest.js'

const QUICK = [
  { to: '/journal/new', icon: 'book', title: 'Write in your journal', text: 'Let thoughts settle on the page.' },
  { to: '/exercises', icon: 'wind', title: 'Take a breathing break', text: 'Two minutes can change a lot.' },
  { to: '/companion', icon: 'chat', title: 'Talk it through', text: 'A kind listener, any time.', paidFeature: 'companion' }
]

export default function Dashboard() {
  useDocumentTitle('Home')
  const { user, access } = useAuth()
  const { chart } = useTheme()
  const today = localDate()
  const from = shiftDate(today, -6)

  const checkins = useAsync(async () => {
    const [moods, sleep] = await Promise.all([checkinsApi.listMoods({ from, to: today }), checkinsApi.listSleep({ from, to: today })])
    return { moods, sleep }
  }, [today])
  const extras = useAsync(async () => {
    const [ex, onboarding] = await Promise.all([exercisesApi.list(), onboardingApi.get().catch(() => null)])
    return { exercises: ex.exercises, goals: onboarding?.profile?.goals || [] }
  }, [])

  const moods = useMemo(() => checkins.data?.moods?.entries || [], [checkins.data])
  const sleeps = useMemo(() => checkins.data?.sleep?.entries || [], [checkins.data])
  const todayMood = moods.find((m) => m.date === today) || null
  const todaySleep = sleeps.find((s) => s.date === today) || null
  const streak = checkins.data?.moods?.streak ?? 0

  const week = useMemo(
    () =>
      lastNDays(7, today).map((date) => ({
        date,
        mood: moods.find((m) => m.date === date)?.mood ?? null,
        sleep: sleeps.find((s) => s.date === date)?.hours ?? null
      })),
    [moods, sleeps, today]
  )

  const suggestion = suggestExercise({
    exercises: extras.data?.exercises,
    mood: todayMood?.mood,
    stress: todayMood?.stress,
    goals: extras.data?.goals,
    premium: access?.premiumExercises
  })

  const onSaved = () => checkins.reload()
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-ink-muted">{longDate(new Date())}</p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            {greeting()}, {firstName}
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-2 shadow-soft">
          <Icon name="flame" className="text-blush" />
          <span className="font-extrabold">{streak}-day streak</span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {checkins.loading && !checkins.data ? (
            <SkeletonCard />
          ) : (
            <CheckInCard todayMood={todayMood} todaySleep={todaySleep} premium={access?.premium} onSaved={onSaved} />
          )}

          <Card>
            <CardHeader
              title="Your week"
              subtitle={moods.length ? `${moods.length} of 7 days checked in` : 'Your mood will appear here after your first check-in.'}
              icon={<Icon name="chart" />}
            />
            <div className="mb-3 flex justify-between px-1">
              {week.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-1">
                  <span className="text-xl" aria-hidden="true">{d.mood ? moodEmoji(d.mood) : '·'}</span>
                  <span className={`text-[11px] font-bold ${d.date === today ? 'text-primary' : 'text-ink-faint'}`}>
                    {new Date(`${d.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'narrow' })}
                  </span>
                </div>
              ))}
            </div>
            <TrendChart data={week} series={[{ key: 'mood', name: 'Mood', color: chart.mood }]} height={150} compact />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden bg-brand-soft">
            <CardHeader title="Suggested for you" subtitle="Based on your goals and today’s check-in" icon={<Icon name="sparkle" />} />
            {suggestion ? (
              <div className="rounded-2xl bg-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-lg font-extrabold">{suggestion.name}</p>
                  <Badge tone={suggestion.premium ? 'lavender' : 'success'}>{minutes(suggestion.defaultDurationSec)}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-muted">{suggestion.description}</p>
                <Button to={`/exercises/${suggestion.id}`} size="sm" className="mt-4">
                  <Icon name="play" size={16} /> Start now
                </Button>
              </div>
            ) : (
              <SkeletonCard />
            )}
          </Card>

          <Card>
            <CardHeader title="Insights" subtitle="Trends, patterns and your weekly summary" icon={<Icon name="chart" />} />
            {access?.insights ? (
              <Button to="/insights" variant="secondary" className="w-full">
                View my insights <Icon name="arrowRight" size={16} />
              </Button>
            ) : (
              <div className="relative min-h-[220px] overflow-hidden rounded-2xl">
                <div className="pointer-events-none select-none pt-10 blur-[3px]" aria-hidden="true">
                  <TrendChart data={week.map((d, i) => ({ ...d, mood: d.mood ?? [3, 4, 3, 4, 5, 4, 4][i] }))} series={[{ key: 'mood', name: 'Mood', color: chart.mood }]} height={110} compact />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-surface/60">
                  <LockedCard compact title="Insights is part of a plan" cta="Unlock insights" />
                </div>
              </div>
            )}
          </Card>

          <div className="grid gap-3">
            {QUICK.map((q) => (
              <Link key={q.to} to={q.to} className="card flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-primary">
                  <Icon name={q.icon} />
                </span>
                <span className="flex-1">
                  <span className="block font-extrabold">{q.title}</span>
                  <span className="block text-sm text-ink-muted">{q.text}</span>
                </span>
                {q.paidFeature && !access?.[q.paidFeature] ? (
                  <Icon name="lock" size={18} className="text-ink-faint" title="Paid plans" />
                ) : (
                  <Icon name="arrowRight" size={18} className="text-ink-faint" />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
