import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import Icon from '../components/ui/Icon.jsx'

const ToastContext = createContext(null)

const TONES = {
  success: { icon: 'check', className: 'text-success' },
  error: { icon: 'alert', className: 'text-danger' },
  info: { icon: 'info', className: 'text-primary' }
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(1)

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const show = useCallback(
    (message, tone = 'info') => {
      const id = nextId.current++
      setToasts((list) => [...list.slice(-2), { id, message, tone }])
      setTimeout(() => dismiss(id), 4000)
    },
    [dismiss]
  )

  const value = useMemo(
    () => ({
      success: (m) => show(m, 'success'),
      error: (m) => show(m, 'error'),
      info: (m) => show(m, 'info')
    }),
    [show]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex max-w-md animate-fadeup items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold shadow-lift">
            <Icon name={TONES[t.tone].icon} className={TONES[t.tone].className} />
            <span>{t.message}</span>
            <button type="button" onClick={() => dismiss(t.id)} className="ml-2 text-ink-faint hover:text-ink" aria-label="Dismiss">
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
