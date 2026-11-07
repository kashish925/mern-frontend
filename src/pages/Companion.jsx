import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { aiApi } from '../api/ai.js'
import ChatMessage, { TypingDots } from '../components/feature/ChatMessage.jsx'
import CrisisBanner from '../components/feature/CrisisBanner.jsx'
import LockedCard from '../components/feature/LockedCard.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import Logo from '../components/ui/Logo.jsx'
import Modal from '../components/ui/Modal.jsx'
import { SkeletonCard } from '../components/ui/Skeleton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { timeAgo } from '../utils/dates.js'

const DEFAULT_DISCLAIMER =
  'HappiTrack is a wellness companion, not a therapist or medical service. It cannot diagnose, prescribe, or handle emergencies.'

const STARTERS = ['I’ve been feeling stressed lately', 'I can’t switch off at night', 'I want to feel more motivated', 'Today was a good day']

export default function Companion() {
  useDocumentTitle('Companion')
  const { access } = useAuth()
  const unlocked = Boolean(access?.companion)
  const history = useAsync(() => (unlocked ? aiApi.conversations() : Promise.resolve(null)), [unlocked])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [crisis, setCrisis] = useState(false)
  const [error, setError] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const endRef = useRef(null)
  const abortRef = useRef(null)

  const [liveUsage, setLiveUsage] = useState(null)
  const [slow, setSlow] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const toast = useToast()
  const conversations = useMemo(() => history.data?.conversations || [], [history.data])
  const disclaimer = history.data?.disclaimer || DEFAULT_DISCLAIMER
  const usage = liveUsage || history.data?.usage || null

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, waiting])

  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    if (!waiting) return undefined
    const timer = setTimeout(() => setSlow(true), 8000)
    return () => {
      clearTimeout(timer)
      setSlow(false)
    }
  }, [waiting])

  const open = (conversation) => {
    abortRef.current?.abort()
    setActiveId(conversation?.id ?? null)
    setMessages((conversation?.messages || []).map((m) => ({ id: m.id, role: m.role, content: m.content })))
    setCrisis(Boolean(conversation?.messages?.some((m) => m.flaggedCrisis)))
    setError('')
    setShowHistory(false)
  }

  const send = async (text) => {
    const message = text.trim()
    if (!message || streaming) return
    setError('')
    setDraft('')
    setStreaming(true)
    setWaiting(true)
    const assistantKey = `a-${Date.now()}`
    const userKey = `u-${Date.now()}`
    setMessages((list) => [...list, { id: userKey, role: 'user', content: message }])
    const controller = new AbortController()
    abortRef.current = controller
    try {
      await aiApi.streamChat({
        message,
        conversationId: activeId || undefined,
        signal: controller.signal,
        onEvent: (event) => {
          if (event.conversationId) setActiveId(event.conversationId)
          if (event.usage) setLiveUsage(event.usage)
          if (event.crisis) setCrisis(true)
          if (event.text) {
            setWaiting(false)
            setMessages((list) =>
              list.some((m) => m.id === assistantKey)
                ? list.map((m) => (m.id === assistantKey ? { ...m, content: m.content + event.text } : m))
                : [...list, { id: assistantKey, role: 'assistant', content: event.text, streaming: true }]
            )
          }
          if (event.error) {
            setWaiting(false)
            const notice = event.error === 'AI companion is not configured'
              ? 'The AI companion isn’t switched on yet. Your message was saved, and replies will work once it’s set up.'
              : event.error
            setMessages((list) => [...list, { id: `n-${Date.now()}`, notice: true, content: notice }])
          }
        }
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        if (err.status === 429) {
          setMessages((list) => list.filter((m) => m.id !== userKey))
          setDraft(message)
          setLiveUsage((u) => (u ? { ...u, remaining: 0, used: u.limit } : u))
        }
        setError(err.message)
      }
    } finally {
      setMessages((list) => list.map((m) => (m.id === assistantKey ? { ...m, streaming: false } : m)))
      setStreaming(false)
      setWaiting(false)
      history.reload()
    }
  }

  const closeDelete = useCallback(() => {
    if (!deleting) setToDelete(null)
  }, [deleting])

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await aiApi.deleteConversation(toDelete.id)
      if (toDelete.id === activeId) open(null)
      toast.success('Conversation deleted')
      setToDelete(null)
      history.reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (!unlocked || history.error?.status === 402) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="card">
          <LockedCard
            title="The companion is on paid plans"
            text="Talk things through with a kind, supportive AI listener whenever you need it. Choose a plan to start chatting. Any past conversations are kept safe."
            cta="Unlock the companion"
          />
        </div>
      </div>
    )
  }

  const historyList = (
    <div className="space-y-2">
      <Button onClick={() => open(null)} className="w-full" variant={activeId ? 'secondary' : 'primary'}>
        <Icon name="plus" size={18} /> New conversation
      </Button>
      {history.loading && !history.data ? <SkeletonCard /> : null}
      <ul className="space-y-1">
        {conversations.map((c) => {
          const last = c.messages[c.messages.length - 1]
          return (
            <li key={c.id} className="group relative">
              <button
                type="button"
                onClick={() => open(c)}
                className={`w-full rounded-2xl py-3 pl-4 pr-11 text-left transition ${activeId === c.id ? 'bg-brand-soft' : 'hover:bg-lavender-mist'}`}
              >
                <p className="line-clamp-1 text-sm font-bold">{c.messages[0]?.content || 'New conversation'}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-faint">
                  {c.messages.some((m) => m.flaggedCrisis) ? <Icon name="heart" size={12} className="text-blush" /> : null}
                  {timeAgo(last?.createdAt || c.createdAt)}
                </p>
              </button>
              <button
                type="button"
                onClick={() => setToDelete(c)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-ink-faint transition hover:bg-blush-mist hover:text-danger focus-visible:text-danger"
                aria-label="Delete this conversation"
                title="Delete"
              >
                <Icon name="trash" size={16} />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block">{historyList}</aside>

      <section className="card flex h-[calc(100vh-13rem)] min-h-[480px] flex-col overflow-hidden lg:h-[calc(100vh-8rem)]" aria-label="Conversation">
        <header className="border-b border-line px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Logo variant="mark" size="md" to={null} />
              <div>
                <h1 className="font-display text-xl font-semibold">Your companion</h1>
                <p className="text-xs text-ink-muted">A kind listener, here any time</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setShowHistory((v) => !v)} aria-expanded={showHistory}>
              History
            </Button>
          </div>
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-surface-muted px-3 py-2 text-xs font-semibold text-ink-muted">
            <Icon name="info" size={14} className="mt-0.5 shrink-0 text-primary" /> {disclaimer}
          </p>
        </header>

        {showHistory ? <div className="max-h-72 overflow-y-auto border-b border-line p-4 lg:hidden">{historyList}</div> : null}

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
          {crisis ? <CrisisBanner /> : null}
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Logo variant="mark" size="lg" to={null} className="!h-20 animate-floaty" />
              <h2 className="mt-4 font-display text-2xl font-semibold">What’s on your mind?</h2>
              <p className="mt-1 max-w-sm text-sm text-ink-muted">Share as much or as little as you like. There’s no wrong way to start.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {STARTERS.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)} className="rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold hover:bg-lavender-light">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => <ChatMessage key={m.id} role={m.role} content={m.content} streaming={m.streaming} notice={m.notice} />)
          )}
          {waiting ? <TypingDots /> : null}
          {waiting && slow ? (
            <p className="pl-10 text-xs font-semibold text-ink-muted" role="status">
              The companion is taking a little longer than usual. Thanks for your patience.
            </p>
          ) : null}
          <div ref={endRef} />
        </div>

        <form
          className="border-t border-line p-3 sm:p-4"
          onSubmit={(e) => {
            e.preventDefault()
            send(draft)
          }}
        >
          {error ? <Alert tone="danger" title={error} className="mb-3" /> : null}
          <div className="flex items-end gap-2">
            <label className="flex-1">
              <span className="sr-only">Message</span>
              <textarea
                rows={1}
                value={draft}
                maxLength={4000}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send(draft)
                  }
                }}
                placeholder="Type how you’re feeling…"
                className="field max-h-40 min-h-[48px] resize-none"
              />
            </label>
            <Button type="submit" className="h-12 w-12 !px-0" disabled={!draft.trim() || streaming} aria-label="Send message">
              <Icon name="send" size={18} />
            </Button>
          </div>
          {usage ? (
            <p
              className={`mt-2 text-center text-[11px] font-bold ${
                usage.remaining === 0 ? 'text-danger' : usage.remaining <= 5 ? 'text-warning' : 'text-ink-muted'
              }`}
            >
              {usage.remaining === 0
                ? `No messages left today. Your ${usage.limit} messages reset at midnight.`
                : `${usage.remaining} of ${usage.limit} messages left today.`}
            </p>
          ) : null}
        </form>
      </section>

      <Modal
        open={Boolean(toDelete)}
        onClose={closeDelete}
        title="Delete this conversation?"
        footer={
          <>
            <Button variant="secondary" onClick={closeDelete} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={confirmDelete}>
              Delete conversation
            </Button>
          </>
        }
      >
        <p>All messages in this conversation will be removed permanently. This doesn’t give back any of today’s messages.</p>
      </Modal>
    </div>
  )
}
