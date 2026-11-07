import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { chartColors, palettes } from '../theme/tokens.js'

const STORAGE_KEY = 'happitrack-theme'
const CHOICES = ['light', 'dark']
const ThemeContext = createContext(null)

function initialTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (CHOICES.includes(value)) return value
  } catch {
    /* storage can be blocked; fall back to the device preference */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode) {
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.style.colorScheme = mode
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palettes[mode].surface.muted)
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(initialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = useCallback((next) => {
    if (!CHOICES.includes(next)) return
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage can be blocked; the choice still applies for this visit */
    }
  }, [])

  const value = useMemo(
    () => ({
      theme,
      resolved: theme,
      setTheme,
      toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      chart: chartColors(theme)
    }),
    [theme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
