import { useState } from 'react'
import Icon from '../ui/Icon.jsx'

export default function TagInput({ value = [], onChange, max = 10, disabled = false }) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const tag = draft.trim().toLowerCase().slice(0, 40)
    if (!tag || value.includes(tag) || value.length >= max) {
      setDraft('')
      return
    }
    onChange([...value, tag])
    setDraft('')
  }

  return (
    <div>
      <label htmlFor="tag-input" className="mb-1.5 block text-sm font-bold">
        Tags
      </label>
      <div className="field flex flex-wrap items-center gap-2 py-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-lavender-light px-3 py-1 text-sm font-bold text-primary">
            #{tag}
            {!disabled ? (
              <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`Remove tag ${tag}`} className="rounded-full hover:text-primary-dark">
                <Icon name="x" size={14} />
              </button>
            ) : null}
          </span>
        ))}
        {!disabled && value.length < max ? (
          <input
            id="tag-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                add()
              } else if (e.key === 'Backspace' && !draft && value.length) {
                onChange(value.slice(0, -1))
              }
            }}
            onBlur={add}
            placeholder={value.length ? 'Add another' : 'Type a tag and press Enter'}
            className="min-w-[140px] flex-1 border-0 bg-transparent py-1 text-sm focus:outline-none"
          />
        ) : null}
      </div>
    </div>
  )
}
