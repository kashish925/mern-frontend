import { useMemo, useState } from 'react'
import { insightsApi } from '../api/insights.js'
import { TrendChart } from '../components/feature/Charts.jsx'
import LockedCard from '../components/feature/LockedCard.jsx'
import Alert from '../components/ui/Alert.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Card, { CardHeader } from '../components/ui/Card.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Icon from '../components/ui/Icon.jsx'
import { SkeletonCard } from '../components/ui/Skeleton.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useTheme } from '../context/ThemeContext.jsx'
import { lastNDays, shortDate } from '../utils/dates.js'

const RANGES = [7, 30, 90]
const RISK = {
  low: { tone: 'success', label: 'Low' },
  medium: { tone: 'warning', label: 'Medium' },
  high: { tone: 'blush', label: 'High' },
  insufficient: { tone: 'neutral', label: 'Not enough data yet' }
}

function sampleInsights(range) {
  const days = lastNDays(range)
  const wave = (i, base, amp) => Math.round((base + amp * Math.sin(i / 2)) * 10) / 10
  return {
    range,
    sample: true,
    series: {
      mood: days.map((date, i) => ({ date, value: Math.round(wave(i, 3.6, 1)) })),
      stress: days.map((date, i) => ({ date, value: Math.round(wave(i + 2, 2.8, 1)) })),
      sleep: days.map((date, i) => ({ date, hours: wave(i, 7, 1.2) }))
    },
    correlations: [{ id: 'sample', title: 'Sleep and mood', detail: 'Mood is higher on days you sleep 7+ hours.' }],
    weeklySummary: { daysWithCheckins: 6, averageMood: 3.8, averageStress: 2.6, averageSleepHours: 7.1, note: 'A short look at the last 7 days.' },
    burnoutRisk: { level: 'low', label: 'Informational only. This is not a medical assessment or a diagnosis.', reason: 'Recent check-ins look steady.' }
  }
}

function buildSeries(data) {
  if (!data) return []
  const days = lastNDays(data.range, data.to || undefined)
  const mood = new Map(data.series.mood.map((p) => [p.date, p.value]))
  const stress = new Map(data.series.stress.map((p) => [p.date, p.value]))
  const sleep = new Map(data.series.sleep.map((p) => [p.date, p.hours]))
  return days.map((date) => ({ date, mood: mood.get(date) ?? null, stress: stress.get(date) ?? null, sleep: sleep.get(date) ?? null }))
}

function Stat({ label, value, suffix, icon }) {
  return (
    <div className="rounded-2xl bg-surface-muted p-4">
      <p className="flex items-center gap-1.5 text-xs font-bold text-ink-muted">
        <Icon name={icon} size={14} /> {label}
      </p>
      <p className="mt-1 font-display text-3xl font-semibold">
        {value ?? '–'}
        {value != null && suffix ? <span className="ml-1 text-base text-ink-muted">{suffix}</span> : null}
      </p>
    </div>
  )
}

function InsightsBody({ data }) {
  const { chart } = useTheme()
  const rows = useMemo(() => buildSeries(data), [data])
  const summary = data.weeklySummary
  const risk = RISK[data.burnoutRisk?.level] || RISK.insufficient
  const hasData = data.series.mood.length > 0 || data.series.sleep.length > 0

  return (
    <div className="space-y-6">
      {!hasData && !data.sample ? (
        <EmptyState title="No check-ins in this range yet" text="Log your mood and sleep on the dashboard and your trends will appear here." action={<Button to="/dashboard">Check in now</Button>} />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Mood" subtitle="1 is very low, 5 is great" icon={<Icon name="heart" />} />
          <TrendChart data={rows} series={[{ key: 'mood', name: 'Mood', color: chart.mood }]} />
        </Card>
        <Card>
          <CardHeader title="Stress" subtitle="1 is calm, 5 is very stressed" icon={<Icon name="flame" />} />
          <TrendChart data={rows} series={[{ key: 'stress', name: 'Stress', color: chart.stress }]} />
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Sleep" subtitle="Hours each night" icon={<Icon name="moon" />} />
          <TrendChart data={rows} series={[{ key: 'sleep', name: 'Sleep', color: chart.sleep }]} yDomain={[0, 12]} unit="h" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Weekly summary"
            subtitle={summary?.from ? `${shortDate(summary.from)} – ${shortDate(summary.to)}` : 'Last 7 days'}
            icon={<Icon name="sparkle" />}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Check-ins" value={summary?.daysWithCheckins} suffix="/ 7" icon="check" />
            <Stat label="Avg mood" value={summary?.averageMood} icon="heart" />
            <Stat label="Avg stress" value={summary?.averageStress} icon="flame" />
            <Stat label="Avg sleep" value={summary?.averageSleepHours} suffix="h" icon="moon" />
          </div>
          <p className="mt-4 text-xs text-ink-faint">{summary?.note}</p>
        </Card>

        <Card>
          <CardHeader title="Burnout indicator" icon={<Icon name="shield" />} />
          <Badge tone={risk.tone} className="text-sm">
            {risk.label}
          </Badge>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{data.burnoutRisk?.reason}</p>
          <p className="mt-3 rounded-xl bg-surface-muted p-3 text-xs font-semibold text-ink-muted">{data.burnoutRisk?.label}</p>
        </Card>
      </div>

      <Card>
        <CardHeader title="Patterns we noticed" icon={<Icon name="chart" />} />
        <ul className="grid gap-3 md:grid-cols-2">
          {data.correlations.map((c) => (
            <li key={c.id} className="rounded-2xl bg-brand-soft p-4">
              <p className="font-extrabold">{c.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{c.detail}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export default function Insights() {
  useDocumentTitle('Insights')
  const [range, setRange] = useState(7)
  const result = useAsync(() => insightsApi.get(range), [range])
  const locked = result.error?.status === 402

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Insights</h1>
          <p className="mt-1 text-ink-muted">Your trends over time. Informational, never a diagnosis.</p>
        </div>
        <div className="flex rounded-full bg-surface p-1 shadow-soft" role="tablist" aria-label="Time range">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={range === r}
              onClick={() => setRange(r)}
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${range === r ? 'bg-brand text-white shadow-soft' : 'text-ink-muted hover:text-ink'}`}
            >
              {r} days
            </button>
          ))}
        </div>
      </header>

      {locked ? (
        <div className="relative">
          <div className="pointer-events-none select-none blur-[5px]" aria-hidden="true">
            <InsightsBody data={sampleInsights(range)} />
          </div>
          <div className="absolute inset-0 flex items-start justify-center bg-surface-muted/40 pt-24">
            <div className="glass max-w-md rounded-3xl">
              <LockedCard
                title="Insights is part of a plan"
                text="See how sleep, stress and mood move together, get a weekly summary, and track your burnout indicator."
                cta="Unlock insights"
              />
            </div>
          </div>
        </div>
      ) : result.error ? (
        <Alert tone="danger" title={result.error.message} action={<Button size="sm" variant="secondary" onClick={result.reload}>Try again</Button>} />
      ) : result.loading && !result.data ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : result.data ? (
        <InsightsBody data={result.data} />
      ) : null}
    </div>
  )
}
