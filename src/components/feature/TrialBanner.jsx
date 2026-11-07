import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { timeLeft } from '../../utils/dates.js'
import Icon from '../ui/Icon.jsx'

export default function TrialBanner() {
  const { access } = useAuth()
  if (!access) return null
  const paid = access.subscription?.status === 'active' && access.companion

  if (paid) return null

  if (access.trialActive) {
    const left = timeLeft(access.trialEndsAt)
    return (
      <div className="bg-brand-soft">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm sm:px-6">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Icon name="sparkle" size={18} className="text-blush" />
            Free trial: {left} left. The AI companion and premium exercises unlock on a paid plan.
          </p>
          <Link to="/pricing" className="font-extrabold text-primary hover:text-primary-dark">
            See plans
          </Link>
        </div>
      </div>
    )
  }

  if (access.trialEndsAt) {
    return (
      <div className="bg-blush-mist">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm sm:px-6">
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Icon name="lock" size={18} className="text-danger" />
            Your free trial has ended. Your past entries are safe and still readable.
          </p>
          <Link to="/pricing" className="font-extrabold text-primary hover:text-primary-dark">
            Choose a plan
          </Link>
        </div>
      </div>
    )
  }

  return null
}
