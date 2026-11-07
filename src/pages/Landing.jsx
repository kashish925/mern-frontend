import { useState } from 'react'
import heroSky from '../assets/hero-sky.jpg'
import logoMark from '../assets/logo-mark.png'
import PlanCard from '../components/feature/PlanCard.jsx'
import Footer from '../components/layout/Footer.jsx'
import PublicNav from '../components/layout/PublicNav.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import Logo from '../components/ui/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useTheme } from '../context/ThemeContext.jsx'
import { PLANS } from '../utils/format.js'

const FEATURES = [
  { icon: 'heart', title: '30-second check-ins', text: 'Mood, stress and sleep in a few taps, so tracking never feels like homework.' },
  { icon: 'book', title: 'A private journal', text: 'Write freely with gentle prompts. Your entries are encrypted and only yours.' },
  { icon: 'wind', title: 'Calm in minutes', text: 'Box breathing, 4-7-8, grounding, meditation timers and wind-down routines.' },
  { icon: 'chart', title: 'See your patterns', text: 'Clear charts show how sleep, stress and mood move together over time.' },
  { icon: 'chat', title: 'A kind companion', text: 'Talk things through with a supportive AI listener. Never a therapist, always gentle.' },
  { icon: 'shield', title: 'Private by design', text: 'Journal and chat text are encrypted at rest. Delete your data any time.' }
]

const STEPS = [
  { title: 'Check in', text: 'Tell us how you feel today in under 30 seconds.' },
  { title: 'Reflect', text: 'Journal, breathe, or chat when you need a moment.' },
  { title: 'Notice', text: 'Watch your patterns and find what truly helps you.' }
]

const TRUST_POINTS = [
  { icon: 'sparkle', value: '3 days', label: 'free to try, no card' },
  { icon: 'wind', value: '14', label: 'guided exercises' },
  { icon: 'shield', value: 'Encrypted', label: 'journal and chats' },
  { icon: 'heart', value: 'Every age', label: 'welcome to join' }
]

const SAMPLE_REVIEWS = [
  {
    name: 'Meera K.',
    role: 'Student',
    rating: 5,
    text: 'The 30-second check-in is the only habit I have kept all year. Seeing my sleep and mood side by side finally made things click.'
  },
  {
    name: 'Daniel R.',
    role: 'Nurse, night shifts',
    rating: 5,
    text: 'Box breathing before bed has become my reset button. The app feels soft and calm, never pushy.'
  },
  {
    name: 'Aisha T.',
    role: 'Product designer',
    rating: 4,
    text: 'I like that the journal is private and encrypted. The prompts help on days I do not know where to start.'
  },
  {
    name: 'Rohan S.',
    role: 'Software engineer',
    rating: 5,
    text: 'Insights showed me my stress spikes on Mondays. Small changes, big difference.'
  },
  {
    name: 'Laura M.',
    role: 'Teacher',
    rating: 5,
    text: 'The companion listens without judging and always reminds me it is not a therapist, which I really appreciate.'
  },
  {
    name: 'Kabir P.',
    role: 'New parent',
    rating: 4,
    text: 'Two minutes of grounding between feeds keeps me sane. Simple, gentle and genuinely helpful.'
  }
]

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" size={16} className={n <= rating ? 'fill-current text-blush' : 'text-line'} />
      ))}
    </div>
  )
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

const FAQ = [
  { q: 'Is HappiTrack a replacement for therapy?', a: 'No. HappiTrack is a wellness and self-reflection tool. It does not diagnose or treat anything. If you are struggling, please reach out to a professional or a helpline.' },
  { q: 'How does the free trial work?', a: 'You get 3 days of free access after onboarding, including Insights, no card needed. The AI companion and premium exercises unlock on a paid plan. After the trial you can still read everything you wrote.' },
  { q: 'Who can see my journal?', a: 'Only you. Journal entries and chats are encrypted before they are stored.' },
  { q: 'Can I cancel any time?', a: 'Yes. Cancel from Settings and you keep access until the end of your billing period.' },
  { q: 'Is there an age limit?', a: 'No. People of any age can use HappiTrack. We use your age range only to keep the tone and content suitable.' }
]

function PhoneMockup({ className = '', children }) {
  return (
    <div className={`w-[230px] rounded-[2.4rem] border-[6px] border-surface/80 bg-surface/85 p-3 shadow-lift backdrop-blur-xl ${className}`}>
      <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-ink/10" />
      {children}
    </div>
  )
}

function HeroMockups() {
  const { chart } = useTheme()
  const bars = [40, 62, 48, 75, 58, 82, 70]
  return (
    <div className="relative mx-auto mt-14 flex max-w-4xl items-end justify-center gap-4 sm:mt-16" aria-hidden="true">
      <div className="glass absolute -left-2 top-10 hidden w-56 rounded-3xl p-4 md:block lg:-left-10 animate-floaty">
        <p className="text-xs font-bold text-ink-muted">This week</p>
        <p className="font-display text-2xl font-semibold">Mood is up 18%</p>
        <div className="mt-3 flex h-16 items-end gap-1.5">
          {bars.map((h, i) => (
            <span key={i} className="flex-1 rounded-t-md bg-brand" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <PhoneMockup className="translate-y-6">
        <p className="text-[11px] font-bold text-ink-muted">Good evening</p>
        <p className="font-display text-lg font-semibold">How are you feeling?</p>
        <div className="mt-3 flex justify-between text-2xl">
          {['😞', '😕', '😐', '🙂', '😄'].map((e, i) => (
            <span key={e} className={`rounded-xl p-1 ${i === 3 ? 'bg-lavender-light ring-2 ring-lavender' : ''}`}>{e}</span>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="rounded-2xl bg-brand-soft p-3">
            <p className="text-[11px] font-bold text-ink-muted">Sleep</p>
            <p className="text-sm font-extrabold">7 h 30 min</p>
          </div>
          <div className="rounded-2xl bg-blush-mist p-3">
            <p className="text-[11px] font-bold text-ink-muted">Suggested</p>
            <p className="text-sm font-extrabold">Box breathing · 4 min</p>
          </div>
        </div>
      </PhoneMockup>
      <PhoneMockup className="hidden sm:block">
        <p className="text-[11px] font-bold text-ink-muted">Your balance score</p>
        <div className="relative mx-auto my-3 h-32 w-32">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke={chart.ringTrack} strokeWidth="12" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="url(#ring)" strokeWidth="12" strokeLinecap="round" strokeDasharray="314" strokeDashoffset="72" />
            <defs>
              <linearGradient id="ring" x1="0" x2="1">
                <stop offset="0%" stopColor={chart.ringStart} />
                <stop offset="100%" stopColor={chart.ringEnd} />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-3xl font-semibold">77</span>
        </div>
        <div className="flex h-14 items-end gap-1">
          {[30, 50, 45, 70, 60, 80, 74].map((h, i) => (
            <span key={i} className="flex-1 rounded-t bg-lavender" style={{ height: `${h}%` }} />
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] font-bold text-ink-muted">Steady progress this week</p>
      </PhoneMockup>
      <div className="glass absolute -right-2 bottom-24 hidden w-52 rounded-3xl p-4 md:block lg:-right-10">
        <div className="flex items-center gap-2">
          <img src={logoMark} alt="" className="h-8 w-auto" />
          <p className="text-sm font-extrabold">5-day streak</p>
        </div>
        <p className="mt-1 text-xs text-ink-muted">Small steps, every day.</p>
      </div>
    </div>
  )
}

function FaqItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-extrabold"
      >
        {item.q}
        <Icon name="chevronDown" className={`shrink-0 text-primary transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? <p className="animate-fadeup px-6 pb-5 text-sm leading-relaxed text-ink-muted">{item.a}</p> : null}
    </div>
  )
}

export default function Landing() {
  useDocumentTitle('Track your mood, find your calm')
  const { user } = useAuth()
  const startTo = user ? '/dashboard' : '/signup'

  return (
    <div className="bg-surface-muted">
      <section className="relative overflow-hidden pb-24 pt-4">
        <img src={heroSky} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/0 via-surface/0 to-surface-muted dark:from-surface-muted/50 dark:via-surface-muted/40" />
        <div className="relative">
          <PublicNav />
          <div className="mx-auto max-w-4xl px-6 pt-16 text-center sm:pt-24">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-primary">
              <Icon name="sparkle" size={16} className="text-blush" /> 3 days free · no card needed
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-white drop-shadow-[0_2px_20px_rgba(124,92,191,0.35)] sm:text-7xl">
              Find balance in your day with HappiTrack
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold text-ink/80">
              Track your mood, sleep and stress in seconds, journal privately, and find calm with guided exercises and a kind AI companion.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button to={startTo} size="lg">
                {user ? 'Open my dashboard' : 'Start your free trial'} <Icon name="arrowRight" size={18} />
              </Button>
              <Button href="#how" size="lg" variant="glass">
                See how it works
              </Button>
            </div>
          </div>
          <HeroMockups />
        </div>
      </section>

      <section aria-labelledby="trusted-heading" className="mx-auto max-w-6xl px-6 pt-4">
        <h2 id="trusted-heading" className="text-center text-sm font-extrabold uppercase tracking-widest text-ink-muted">
          Trusted by people building calmer days
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map((t) => (
            <li key={t.label} className="card flex items-center gap-3 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-primary">
                <Icon name={t.icon} />
              </span>
              <span>
                <span className="block font-display text-xl font-semibold text-ink">{t.value}</span>
                <span className="block text-sm text-ink-muted">{t.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-widest text-blush">Everything in one calm place</p>
          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Gentle tools for everyday wellbeing</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lift">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-primary transition group-hover:bg-brand group-hover:text-white">
                <Icon name={f.icon} />
              </span>
              <h3 className="mt-4 text-lg font-extrabold">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="scroll-mt-24 bg-brand-soft py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-4xl font-semibold sm:text-5xl">How it works</h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="glass rounded-3xl p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand font-display text-lg font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-xl font-extrabold">{s.title}</h3>
                <p className="mt-1 text-ink-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="reviews" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-widest text-blush">Kind words</p>
          <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">What people say about HappiTrack</h2>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_REVIEWS.map((r) => (
            <li key={r.name}>
              <figure className="card flex h-full flex-col p-6">
                <Stars rating={r.rating} />
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink">“{r.text}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-white" aria-hidden="true">
                    {initials(r.name)}
                  </span>
                  <span>
                    <span className="block font-extrabold text-ink">{r.name}</span>
                    <span className="block text-xs text-ink-muted">{r.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">Simple, honest pricing</h2>
          <p className="mt-3 text-ink-muted">Start with 3 free days. Choose a plan when you’re ready.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} ctaTo={user ? '/pricing' : '/signup'} ctaLabel={user ? 'Choose plan' : 'Start free trial'} />
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 pb-20">
        <h2 className="text-center font-display text-4xl font-semibold">Questions, answered</h2>
        <div className="mt-10 space-y-3">
          {FAQ.map((item) => (
            <FaqItem key={item.q} item={item} />
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-brand px-8 py-14 text-center shadow-lift">
          <img src={logoMark} alt="" className="mx-auto h-16 w-auto drop-shadow-lg" />
          <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">Your calmer days start today</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">It takes less than a minute to begin. No card, no pressure.</p>
          <Button to={startTo} size="lg" variant="glass" className="mt-8">
            {user ? 'Open my dashboard' : 'Start your free trial'}
          </Button>
        </div>
        <div className="mt-8 flex justify-center">
          <Logo variant="mark" size="sm" />
        </div>
      </section>

      <Footer />
    </div>
  )
}
