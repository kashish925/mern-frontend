import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { cleanPath, isPrivatePath, track } from './track.js'

const SCROLL_STEPS = [25, 50, 75, 90]

function areaOf(element) {
  if (element.closest('[role="dialog"]')) return 'dialog'
  if (element.closest('nav')) return 'nav'
  if (element.closest('header')) return 'header'
  if (element.closest('footer')) return 'footer'
  if (element.closest('aside')) return 'sidebar'
  if (element.closest('main')) return 'main'
  return 'page'
}

function destinationOf(link) {
  const href = link.getAttribute('href') || ''
  if (href.startsWith('#')) return { link_url: href }
  try {
    const url = new URL(link.href, window.location.origin)
    if (url.origin === window.location.origin) return { link_url: cleanPath(url.pathname) + (url.hash || '') }
    if (url.protocol === 'tel:' || url.protocol === 'mailto:') return { link_url: url.protocol.replace(':', ''), outbound: true }
    return { link_url: url.hostname, outbound: true }
  } catch {
    return {}
  }
}

function labelOf(element) {
  if (element.dataset.track) return element.dataset.track
  if (isPrivatePath()) return undefined
  return element.getAttribute('aria-label') || element.textContent
}

export default function AnalyticsListener() {
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      track('page_view', { page_title: document.title, private_page: isPrivatePath(location.pathname) })
    }, 300)
    return () => clearTimeout(timer)
  }, [location.pathname])

  useEffect(() => {
    const reached = new Set()
    const startedAt = Date.now()
    const onScroll = () => {
      if (Date.now() - startedAt < 1000) return
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const percent = Math.round((window.scrollY / scrollable) * 100)
      for (const step of SCROLL_STEPS) {
        if (percent >= step && !reached.has(step)) {
          reached.add(step)
          track('scroll_depth', { scroll_percent: step })
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  useEffect(() => {
    const onClick = (event) => {
      const element = event.target.closest?.('a, button, [role="button"]')
      if (!element) return
      const isLink = element.tagName === 'A'
      track('ui_click', {
        click_type: isLink ? 'link' : 'button',
        click_label: labelOf(element),
        click_area: areaOf(element),
        ...(isLink ? destinationOf(element) : {})
      })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
