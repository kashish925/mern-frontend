const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
const MUTATING = ['POST', 'PUT', 'PATCH', 'DELETE']
const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
export const UNAUTHORIZED_EVENT = 'happitrack:unauthorized'

let csrfToken = null
let csrfPromise = null

const FRIENDLY = {
  0: 'Could not reach HappiTrack. Check your connection and try again.',
  401: 'Please log in to continue.',
  402: 'This needs an active trial or plan.',
  403: 'That action is not allowed.',
  404: 'We could not find that.',
  413: 'That is too large to save.',
  429: 'Too many attempts. Please wait a few minutes and try again.',
  500: 'Something went wrong on our side. Please try again.',
  503: 'This feature is not set up yet.'
}

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }

  get validationMessages() {
    const fieldErrors = this.details?.fieldErrors || {}
    return Object.values(fieldErrors).flat().filter(Boolean)
  }
}

function buildError(status, data) {
  const message = data?.error?.message || FRIENDLY[status] || FRIENDLY[500]
  const error = new ApiError(status, message, data?.error?.details)
  if (status === 400 && message === 'Validation failed' && error.validationMessages.length) {
    error.message = error.validationMessages[0]
  }
  return error
}

async function fetchCsrf() {
  const res = await fetch(`${BASE}/csrf`, { credentials: 'include' })
  if (!res.ok) throw buildError(res.status, await res.json().catch(() => null))
  const data = await res.json()
  csrfToken = data.csrfToken
  return csrfToken
}

export function ensureCsrf() {
  if (csrfToken) return Promise.resolve(csrfToken)
  if (!csrfPromise) csrfPromise = fetchCsrf().finally(() => (csrfPromise = null))
  return csrfPromise
}

export function qs(params = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, value)
  }
  const text = search.toString()
  return text ? `?${text}` : ''
}

export async function request(path, options = {}) {
  const { method = 'GET', body, signal, raw = false, retried = false, silent401 = false } = options
  const mutating = MUTATING.includes(method)
  const headers = { Accept: raw ? 'text/event-stream' : 'application/json', 'x-timezone': TIME_ZONE }
  if (mutating) headers['x-csrf-token'] = await ensureCsrf()
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'include',
      signal
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError(0, FRIENDLY[0])
  }

  if (res.status === 403 && mutating && !retried) {
    const data = await res.clone().json().catch(() => null)
    if (/csrf/i.test(data?.error?.message || '')) {
      csrfToken = null
      return request(path, { ...options, retried: true })
    }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    if (res.status === 401 && !silent401) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    throw buildError(res.status, data)
  }

  if (raw) return res
  if (res.status === 204) return null
  return res.json().catch(() => null)
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body: body ?? {} }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body: body ?? {} }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE', body: {} })
}
