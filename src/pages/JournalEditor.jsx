import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { journalApi } from '../api/journal.js'
import TagInput from '../components/feature/TagInput.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Icon from '../components/ui/Icon.jsx'
import Modal from '../components/ui/Modal.jsx'
import { SkeletonCard } from '../components/ui/Skeleton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { longDate } from '../utils/dates.js'
import { MOOD_TAGS } from '../utils/format.js'

export default function JournalEditor() {
  const { id } = useParams()
  const isNew = !id
  useDocumentTitle(isNew ? 'New journal entry' : 'Journal entry')
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { access } = useAuth()
  const canWrite = access?.journalWrite

  const existing = useAsync(() => (isNew ? Promise.resolve(null) : journalApi.get(id)), [id])
  const prompts = useAsync(() => journalApi.prompts(), [])
  const [form, setForm] = useState({ title: '', content: params.get('prompt') ? `${params.get('prompt')}\n\n` : '', moodTag: '', tags: [] })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const entry = existing.data?.entry
    if (entry) setForm({ title: entry.title || '', content: entry.content || '', moodTag: entry.moodTag || '', tags: entry.tags || [] })
  }, [existing.data])

  const save = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.content.trim()) {
      setError('Write at least a few words before saving.')
      return
    }
    setSaving(true)
    const body = { title: form.title.trim(), content: form.content.trim(), moodTag: form.moodTag || null, tags: form.tags }
    try {
      if (isNew) {
        const { entry } = await journalApi.create(body)
        toast.success('Entry saved')
        navigate(`/journal/${entry.id}`, { replace: true })
      } else {
        await journalApi.update(id, body)
        toast.success('Changes saved')
        existing.reload()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    setDeleting(true)
    try {
      await journalApi.remove(id)
      toast.success('Entry deleted')
      navigate('/journal', { replace: true })
    } catch (err) {
      setError(err.message)
      setConfirmDelete(false)
    } finally {
      setDeleting(false)
    }
  }

  if (!isNew && existing.loading && !existing.data) return <SkeletonCard />
  if (!isNew && existing.error) {
    return (
      <Alert
        tone={existing.error.status === 404 ? 'warning' : 'danger'}
        title={existing.error.status === 404 ? 'We couldn’t find that entry' : existing.error.message}
        action={<Button to="/journal" size="sm">Back to journal</Button>}
      />
    )
  }
  if (isNew && !canWrite) {
    return (
      <Alert tone="info" title="New entries need a plan" action={<Button to="/pricing" size="sm">See plans</Button>}>
        Your trial has ended. You can still read everything you wrote before.
      </Alert>
    )
  }

  const entry = existing.data?.entry
  const readOnly = !canWrite

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Button to="/journal" variant="ghost" size="sm">
          <Icon name="arrowLeft" size={16} /> Journal
        </Button>
        {!isNew && canWrite ? (
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            <Icon name="trash" size={16} /> Delete
          </Button>
        ) : null}
      </div>

      {readOnly ? <Alert tone="info" title="Read-only">Choose a plan to edit entries again.</Alert> : null}

      <Card as="form" onSubmit={save} className="space-y-5">
        <h1 className="sr-only">{isNew ? 'New journal entry' : 'Journal entry'}</h1>
        {entry ? <p className="text-sm font-bold text-ink-faint">{longDate(entry.createdAt)}</p> : null}
        <input
          className="w-full border-0 bg-transparent font-display text-3xl font-semibold placeholder:text-ink-faint focus:outline-none"
          placeholder="Give it a title (optional)"
          value={form.title}
          maxLength={200}
          disabled={readOnly}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          aria-label="Title"
        />

        {isNew && prompts.data?.prompts?.length ? (
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-blush">Need a starting point?</p>
            <div className="flex flex-wrap gap-2">
              {prompts.data.prompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, content: f.content.trim() ? `${f.content}\n\n${p}\n` : `${p}\n\n` }))}
                  className="rounded-full bg-brand-soft px-3.5 py-1.5 text-left text-sm font-semibold text-ink hover:bg-lavender-light"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <label className="block">
          <span className="sr-only">Journal entry</span>
          <textarea
            className="field min-h-[320px] text-base leading-relaxed"
            placeholder="What’s on your mind today?"
            value={form.content}
            maxLength={20000}
            disabled={readOnly}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
          <label className="block space-y-1.5">
            <span className="block text-sm font-bold">Mood</span>
            <select className="field capitalize" value={form.moodTag} disabled={readOnly} onChange={(e) => setForm({ ...form, moodTag: e.target.value })}>
              <option value="">No mood tag</option>
              {MOOD_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <TagInput value={form.tags} disabled={readOnly} onChange={(tags) => setForm({ ...form, tags })} />
        </div>

        {error ? <Alert tone="danger" title={error} /> : null}

        {!readOnly ? (
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Icon name="shield" size={14} /> Encrypted before it’s saved
            </p>
            <Button type="submit" loading={saving}>
              <Icon name="check" size={18} /> {isNew ? 'Save entry' : 'Save changes'}
            </Button>
          </div>
        ) : null}
      </Card>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this entry?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Keep it
            </Button>
            <Button variant="danger" loading={deleting} onClick={remove}>
              Delete forever
            </Button>
          </>
        }
      >
        This can’t be undone.
      </Modal>
    </div>
  )
}
