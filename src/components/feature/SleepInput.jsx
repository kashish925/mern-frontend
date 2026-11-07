import Icon from '../ui/Icon.jsx'

export default function SleepInput({ value, onChange, disabled = false }) {
  const hours = value === '' || value === null ? '' : Number(value)
  const step = (delta) => {
    const base = hours === '' ? 7 : hours
    onChange(Math.min(24, Math.max(0, Math.round((base + delta) * 2) / 2)))
  }
  return (
    <div>
      <label htmlFor="sleep-hours" className="mb-2 block text-sm font-bold">
        Hours slept last night
      </label>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => step(-0.5)} disabled={disabled} className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-line text-xl font-extrabold text-ink hover:border-lavender" aria-label="Half an hour less">
          −
        </button>
        <div className="relative flex-1">
          <Icon name="moon" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender" />
          <input
            id="sleep-hours"
            type="number"
            inputMode="decimal"
            min="0"
            max="24"
            step="0.5"
            placeholder="7.5"
            value={hours}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            className="field pl-11 text-center font-extrabold"
          />
        </div>
        <button type="button" onClick={() => step(0.5)} disabled={disabled} className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-line text-xl font-extrabold text-ink hover:border-lavender" aria-label="Half an hour more">
          +
        </button>
      </div>
    </div>
  )
}
