import { useTheme } from '../../context/ThemeContext.jsx'
import { clock } from '../../utils/format.js'

export default function TimerRing({ total, remaining, label }) {
  const { chart } = useTheme()
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const progress = total ? 1 - remaining / total : 0
  return (
    <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80">
      <svg viewBox="0 0 280 280" className="h-full w-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="timer-ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={chart.ringStart} />
            <stop offset="100%" stopColor={chart.ringEnd} />
          </linearGradient>
        </defs>
        <circle cx="140" cy="140" r={radius} fill="none" stroke={chart.ringTrack} strokeWidth="16" />
        <circle
          cx="140"
          cy="140"
          r={radius}
          fill="none"
          stroke="url(#timer-ring)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-live="polite">
        <p className="font-display text-6xl font-semibold">{clock(remaining)}</p>
        {label ? <p className="mt-1 text-sm font-bold text-ink-muted">{label}</p> : null}
      </div>
    </div>
  )
}
