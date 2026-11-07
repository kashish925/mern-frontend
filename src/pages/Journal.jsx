import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { journalApi } from '../api/journal.js'
import Alert from '../components/ui/Alert.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Icon from '../components/ui/Icon.jsx'
import Modal from '../components/ui/Modal.jsx'
import { SkeletonCard } from '../components/ui/Skeleton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { longDate, timeAgo } from '../utils/dates.js'
import { MOOD_TAGS } from '../utils/format.js'

const EMPTY_FILTERS = { q: '', tag: '', moodTag: '', date: '' }

export default function Journal() {
  useDocumentTitle('Journal')
  const { access } = useAuth()
  const canWrite = access?.journalWrite
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const t = setTimeout(() => setApplied(filters), 300)
    return () => clearTimeout(t)
  }, [filters])

  const list = useAsync(
    () =>
      journalApi.list({
        q: applied.q.trim(),
        tag: applied.tag.trim().toLowerCase(),
        moodTag: applied.moodTag,
        from: applied.date,
        to: applied.date
      }),
    [applied]
  )
  const prompts = useAsync(() => journalApi.prompts(), [])
  const entries = list.data?.entries || []
  const hasFilters = Object.values(applied).some(Boolean)
  const promptOfDay = prompts.data?.prompts?.[new Date().getDate() % (prompts.data?.prompts?.length || 1)]

  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))

  const closeDelete = useCallback(() => {
    if (!deleting) setToDelete(null)
  }, [deleting])

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await journalApi.remove(toDelete.id)
      toast.success('Entry deleted')
      setToDelete(null)
      list.reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Journal</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
            <Icon name="shield" size={16} className="text-primary" /> Private and encrypted. Only you can read it.
          </p>
        </div>
        {canWrite ? (
          <Button to="/journal/new">
            <Icon name="plus" size={18} /> New entry
          </Button>
        ) : null}
      </header>

      {!canWrite ? (
        <Alert tone="info" title="Your journal is read-only right now" action={<Button to="/pricing" size="sm">See plans</Button>}>
          Your trial has ended, so new entries and edits need a plan. Everything you wrote is still here.
        </Alert>
      ) : promptOfDay ? (
        <Link to={`/journal/new?prompt=${encodeURIComponent(promptOfDay)}`} className="glass flex items-center gap-4 rounded-2xl p-5 transition hover:shadow-lift">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
            <Icon name="sparkle" />
          </span>
          <span className="flex-1">
            <span className="block text-xs font-extrabold uppercase tracking-wider text-blush">Today’s prompt</span>
            <span className="block font-display text-lg font-semibold">{promptOfDay}</span>
          </span>
          <Icon name="arrowRight" className="text-primary" />
        </Link>
      ) : null}

      <div className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search titles</span>
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input className="field pl-11" placeholder="Search titles" value={filters.q} onChange={set('q')} maxLength={100} />
        </label>
        <label className="block">
          <span className="sr-only">Tag</span>
          <input className="field" placeholder="#tag" value={filters.tag} onChange={set('tag')} maxLength={40} />
        </label>
        <label className="block">
          <span className="sr-only">Mood</span>
          <select className="field" value={filters.moodTag} onChange={set('moodTag')}>
            <option value="">Any mood</option>
            {MOOD_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Date</span>
          <input type="date" className="field" value={filters.date} onChange={set('date')} aria-label="Date" />
        </label>
        <Button variant="ghost" onClick={() => setFilters(EMPTY_FILTERS)} disabled={!Object.values(filters).some(Boolean)}>
          Clear
        </Button>
      </div>

      {list.error ? <Alert tone="danger" title={list.error.message} action={<Button size="sm" variant="secondary" onClick={list.reload}>Try again</Button>} /> : null}

      {list.loading && !list.data ? (
        <div className="grid gap-4 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : entries.length === 0 && !list.error ? (
        hasFilters ? (
          <EmptyState title="No entries match" text="Try a different search or clear the filters." action={<Button variant="secondary" onClick={() => setFilters(EMPTY_FILTERS)}>Clear filters</Button>} />
        ) : (
          <EmptyState
            title="Your journal is waiting"
            text="Write a few lines about your day. There’s no right way to do it."
            action={canWrite ? <Button to="/journal/new">Write your first entry</Button> : null}
          />
        )
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <li key={entry.id} className="relative">
              <Link to={`/journal/${entry.id}`} className="card flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                <h2 className={`line-clamp-1 text-lg font-extrabold ${canWrite ? 'pr-20' : ''}`}>{entry.title || 'Untitled entry'}</h2>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-ink-faint" title={longDate(entry.createdAt)}>
                  {timeAgo(entry.createdAt)}
                  {entry.moodTag ? <Badge tone="blush" className="capitalize">{entry.moodTag}</Badge> : null}
                </p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-muted">{entry.content}</p>
                {entry.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {entry.tags.map((t) => (
                      <span key={t} className="text-xs font-bold text-primary">
                        #{t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
              {canWrite ? (
                <div className="absolute right-3 top-3 flex gap-1">
                  <Link
                    to={`/journal/${entry.id}`}
                    className="rounded-full p-2 text-ink-muted transition hover:bg-lavender-mist hover:text-primary"
                    aria-label={`Edit ${entry.title || 'untitled entry'}`}
                    title="Edit"
                  >
                    <Icon name="edit" size={18} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setToDelete(entry)}
                    className="rounded-full p-2 text-ink-muted transition hover:bg-blush-mist hover:text-danger"
                    aria-label={`Delete ${entry.title || 'untitled entry'}`}
                    title="Delete"
                  >
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={Boolean(toDelete)}
        onClose={closeDelete}
        title="Delete this entry?"
        footer={
          <>
            <Button variant="secondary" onClick={closeDelete} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={confirmDelete}>
              Delete entry
            </Button>
          </>
        }
      >
        <p>
          “{toDelete?.title || 'Untitled entry'}” will be removed permanently. This can’t be undone.
        </p>
      </Modal>
    </div>
  )
}
