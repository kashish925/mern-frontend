import { useEffect, useState } from 'react'

export default function BreathingCircle({ pattern, running }) {
  const [state, setState] = useState({ phase: 0, left: pattern[0].seconds })

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => {
      setState(({ phase, left }) => {
        if (left > 1) return { phase, left: left - 1 }
        const next = (phase + 1) % pattern.length
        return { phase: next, left: pattern[next].seconds }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, pattern])

  const phase = pattern[state.phase]

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
        <div className="absolute inset-0 rounded-full bg-lavender-light/60" />
        <div
          className="absolute inset-6 rounded-full bg-brand opacity-90 shadow-lift"
          style={{
            transform: `scale(${running ? phase.scale : 0.75})`,
            transition: `transform ${running ? phase.seconds : 0.6}s ease-in-out`
          }}
        />
        <div className="relative text-center text-white" aria-live="polite">
          <p className="font-display text-3xl font-semibold drop-shadow">{running ? phase.label : 'Ready'}</p>
          {running ? <p className="mt-1 text-5xl font-extrabold drop-shadow">{state.left}</p> : null}
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-muted">{pattern.map((p) => `${p.label} ${p.seconds}`).join(' · ')}</p>
    </div>
  )
}
