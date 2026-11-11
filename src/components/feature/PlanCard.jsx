import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'

const INCLUDES = [
  'Daily mood, sleep and stress check-ins',
  'Private encrypted journal',
  'All guided exercises',
  'AI companion for supportive chats',
  'Insights, trends and weekly summaries'
]

export default function PlanCard({ plan, current = false, onChoose, loading = false, ctaTo, ctaLabel = 'Choose plan', headingLevel: Heading = 'h3' }) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl p-6 transition ${
        plan.featured ? 'bg-brand text-white shadow-lift' : 'card hover:-translate-y-1 hover:shadow-lift'
      }`}
    >
      {plan.featured ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-surface px-3 py-1 text-xs font-extrabold text-primary shadow-soft">
          Most popular
        </span>
      ) : null}
      <div className="flex items-center justify-between">
        <Heading className={`text-lg font-extrabold ${plan.featured ? 'text-white' : ''}`}>{plan.name}</Heading>
        {current ? <Badge tone={plan.featured ? 'neutral' : 'success'}>Current plan</Badge> : null}
      </div>
      <p className="mt-4 flex items-end gap-1">
        <span className={`font-display text-5xl font-semibold ${plan.featured ? 'text-white' : 'text-ink'}`}>${plan.price}</span>
        <span className={`pb-2 text-sm font-semibold ${plan.featured ? 'text-white/80' : 'text-ink-muted'}`}>/ {plan.period}</span>
      </p>
      <p className={`text-sm ${plan.featured ? 'text-white/85' : 'text-ink-muted'}`}>{plan.note}</p>
      <ul className="my-6 flex-1 space-y-2.5 text-sm">
        {INCLUDES.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Icon name="check" size={18} className={plan.featured ? 'text-white' : 'text-primary'} />
            <span className={plan.featured ? 'text-white' : 'text-ink'}>{item}</span>
          </li>
        ))}
      </ul>
      {ctaTo ? (
        <Button to={ctaTo} variant={plan.featured ? 'glass' : 'primary'} className="w-full">
          {ctaLabel}
        </Button>
      ) : (
        <Button
          variant={plan.featured ? 'glass' : 'primary'}
          className="w-full"
          onClick={() => onChoose?.(plan)}
          loading={loading}
          disabled={current}
        >
          {current ? 'Your current plan' : ctaLabel}
        </Button>
      )}
    </div>
  )
}
