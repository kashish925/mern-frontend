import { lazy } from 'react'

export function lazyPage(load) {
  const Page = lazy(load)
  Page.preload = load
  return Page
}

export function preloadWhenIdle(pages) {
  const run = () => pages.forEach((page) => page.preload().catch(() => {}))
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(run, { timeout: 3000 })
    return () => window.cancelIdleCallback(id)
  }
  const id = window.setTimeout(run, 1500)
  return () => window.clearTimeout(id)
}
