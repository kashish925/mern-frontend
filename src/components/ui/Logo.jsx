import { Link } from 'react-router-dom'
import logoFull from '../../assets/logo.png'
import logoMark from '../../assets/logo-mark.png'
import logoWordmark from '../../assets/logo-wordmark.png'

const HEIGHTS = { sm: 'h-8', md: 'h-10', lg: 'h-12' }

export default function Logo({ variant = 'horizontal', size = 'md', to = '/', className = '' }) {
  let content
  if (variant === 'full') {
    content = <img src={logoFull} alt="HappiTrack" className={`h-auto w-48 ${className}`} />
  } else if (variant === 'mark') {
    content = <img src={logoMark} alt="HappiTrack" className={`${HEIGHTS[size]} w-auto ${className}`} />
  } else {
    content = (
      <span className={`flex items-center gap-1.5 ${className}`}>
        <img src={logoMark} alt="" className={`${HEIGHTS[size]} w-auto`} />
        <img src={logoWordmark} alt="HappiTrack" className={size === 'sm' ? 'h-5 w-auto' : 'h-6 w-auto'} />
      </span>
    )
  }
  if (!to) return content
  return (
    <Link to={to} className="inline-flex rounded-xl" aria-label="HappiTrack home">
      {content}
    </Link>
  )
}
