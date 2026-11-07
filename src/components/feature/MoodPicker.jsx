import { MOODS } from '../../utils/format.js'

export default function MoodPicker({ value, onChange, disabled = false }) {
  return (
    <fieldset disabled={disabled}>
      <legend className="sr-only">How are you feeling?</legend>
      <div className="grid grid-cols-5 gap-2">
        {MOODS.map((m) => (
          <label
            key={m.value}
            className={`option-focus group flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 py-3 transition ${
              value === m.value ? 'border-primary bg-brand-soft shadow-soft' : 'border-transparent bg-surface-muted hover:border-lavender'
            }`}
          >
            <input type="radio" name="mood" value={m.value} checked={value === m.value} onChange={() => onChange(m.value)} className="sr-only" />
            <span className={`text-3xl transition sm:text-4xl ${value === m.value ? 'scale-110' : 'group-hover:scale-105'}`} aria-hidden="true">
              {m.emoji}
            </span>
            <span className="text-[11px] font-bold text-ink-muted sm:text-xs">{m.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function LevelPicker({ label, value, onChange, lowLabel, highLabel, name, disabled = false }) {
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-2 text-sm font-bold">{label}</legend>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className={`option-focus flex h-11 flex-1 cursor-pointer items-center justify-center rounded-xl border-2 font-extrabold transition ${
              value === n ? 'border-primary bg-primary text-white' : 'border-line bg-surface text-ink hover:border-lavender'
            }`}
          >
            <input type="radio" name={name} value={n} checked={value === n} onChange={() => onChange(n)} className="sr-only" />
            {n}
          </label>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-ink-faint">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </fieldset>
  )
}

export function TagChips({ options, value = [], onChange, max = 8, disabled = false }) {
  const toggle = (tag) =>
    onChange((current) => {
      if (current.includes(tag)) return current.filter((t) => t !== tag)
      return current.length < max ? [...current, tag] : current
    })
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Tags">
      {options.map((tag) => {
        const active = value.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            disabled={disabled}
            onClick={() => toggle(tag)}
            aria-pressed={active}
            className={`rounded-full px-3.5 py-1.5 text-sm font-bold capitalize transition ${
              active ? 'bg-brand text-white shadow-soft' : 'bg-surface-muted text-ink-muted hover:bg-lavender-mist hover:text-ink'
            }`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
