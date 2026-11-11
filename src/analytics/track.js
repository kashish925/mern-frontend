const PRIVATE_PREFIXES = ['/dashboard', '/journal', '/exercises', '/insights', '/companion', '/settings', '/onboarding']

export function isPrivatePath(path = window.location.pathname) {
  return PRIVATE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

export function cleanPath(path = window.location.pathname) {
  return path
    .split('?')[0]
    .split('#')[0]
    .replace(/\/[a-f\d]{24}(?=\/|$)/gi, '/:id')
}

function cleanValue(value) {
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (value === null || value === undefined) return undefined
  return String(value).replace(/\s+/g, ' ').trim().slice(0, 100)
}

export function track(event, params = {}) {
  if (typeof window === 'undefined') return
  const payload = { event, page_path: cleanPath() }
  for (const [key, value] of Object.entries(params)) {
    const cleaned = cleanValue(value)
    if (cleaned !== undefined && cleaned !== '') payload[key] = cleaned
  }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
}
