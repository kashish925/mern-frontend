export default function ScaleQuestion({ question, value, onChange }) {
  return (
    <fieldset>
      <legend className="font-display text-2xl font-semibold leading-snug sm:text-3xl">{question.text}</legend>
      <p className="mt-2 text-sm text-ink-muted">Think about the past two weeks.</p>
      <div className="mt-6 grid grid-cols-5 gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className={`option-focus flex cursor-pointer flex-col items-center rounded-2xl border-2 py-4 font-display text-2xl font-semibold transition ${
              value === n ? 'border-primary bg-brand-soft text-primary shadow-soft' : 'border-line bg-surface text-ink hover:border-lavender'
            }`}
          >
            <input type="radio" name={question.key} value={n} checked={value === n} onChange={() => onChange(n)} className="sr-only" />
            {n}
          </label>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs font-bold text-ink-muted">
        <span>{question.low}</span>
        <span>{question.high}</span>
      </div>
    </fieldset>
  )
}
