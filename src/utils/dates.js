export function localDate(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function shiftDate(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  return localDate(date)
}

export function lastNDays(n, end = localDate()) {
  return Array.from({ length: n }, (_, i) => shiftDate(end, i - (n - 1)))
}

export function shortDay(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'short' })
}

export function shortDate(value) {
  const date = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(...value.split('-').map((n, i) => (i === 1 ? Number(n) - 1 : Number(n))))
    : new Date(value)
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

export function longDate(value) {
  return new Date(value).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function timeAgo(value) {
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days} d ago`
  return shortDate(value)
}

export function greeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 5) return 'Hello'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function timeLeft(until) {
  const ms = new Date(until).getTime() - Date.now()
  if (ms <= 0) return null
  const hours = Math.floor(ms / 3_600_000)
  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    return `${days} day${days === 1 ? '' : 's'} ${hours % 24} h`
  }
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  return `${hours} h ${minutes} min`
}
