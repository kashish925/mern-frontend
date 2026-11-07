import { useTheme } from '../../context/ThemeContext.jsx'
import Icon from './Icon.jsx'

export default function ThemeToggle({ className = '' }) {
  const { resolved, toggle } = useTheme()
  const dark = resolved === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      className={`rounded-full p-2 text-ink-muted transition hover:bg-lavender-mist hover:text-ink ${className}`}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  )
}
