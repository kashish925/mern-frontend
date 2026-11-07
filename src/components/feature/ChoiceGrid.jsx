import Icon from '../ui/Icon.jsx'

export default function ChoiceGrid({ options, value, onChange, multiple = false, name }) {
  const selected = multiple ? value || [] : value
  const toggle = (option) => {
    if (!multiple) return onChange(option)
    onChange(selected.includes(option) ? selected.filter((v) => v !== option) : [...selected, option])
  }
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {options.map((o) => {
        const active = multiple ? selected.includes(o.value) : selected === o.value
        return (
          <label
            key={o.value}
            className={`option-focus flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3.5 font-bold transition ${
              active ? 'border-primary bg-brand-soft text-primary shadow-soft' : 'border-line bg-surface text-ink hover:border-lavender'
            }`}
          >
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={name}
              value={o.value}
              checked={active}
              onChange={() => toggle(o.value)}
              className="sr-only"
            />
            <span>{o.label}</span>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${active ? 'bg-primary text-white' : 'border border-line'}`}>
              {active ? <Icon name="check" size={14} strokeWidth={3} /> : null}
            </span>
          </label>
        )
      })}
    </div>
  )
}
