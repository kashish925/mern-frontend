import { useLocation, useNavigate } from 'react-router-dom'
import MockCheckout from '../components/feature/MockCheckout.jsx'
import PlanCard from '../components/feature/PlanCard.jsx'
import PublicLayout from '../components/layout/PublicLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import Icon from '../components/ui/Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCheckout } from '../hooks/useCheckout.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { PLANS } from '../utils/format.js'

export default function Pricing() {
  useDocumentTitle('Plans and pricing')
  const { user, access } = useAuth()
  const { choose, pendingPlan, error, mockCheckout, payMock, closeMock } = useCheckout()
  const activePlan = access?.subscription?.status === 'active' ? access.subscription.plan : null
  const navigate = useNavigate()
  const location = useLocation()
  const goBack = () => {
    if (location.key !== 'default') navigate(-1)
    else navigate(user ? '/dashboard' : '/', { replace: true })
  }

  return (
    <PublicLayout plain>
      <section className="mx-auto max-w-6xl px-6 py-14">
        <Button variant="ghost" size="sm" onClick={goBack} className="mb-6">
          <Icon name="arrowLeft" size={16} /> Back
        </Button>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-semibold sm:text-6xl">Choose your calm</h1>
          <p className="mt-3 text-ink-muted">
            Every plan includes everything in HappiTrack, including Insights and the AI companion. Cancel any time from Settings.
          </p>
        </div>
        {error ? <Alert tone="danger" title={error} className="mx-auto mt-8 max-w-xl" /> : null}
        {activePlan ? (
          <Alert tone="success" title="You have an active plan" className="mx-auto mt-8 max-w-xl" action={<Button to="/settings" size="sm" variant="secondary">Manage billing</Button>} />
        ) : null}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) =>
            user && activePlan && activePlan !== plan.id ? (
              <PlanCard key={plan.id} plan={plan} ctaTo="/settings" ctaLabel="Manage billing" />
            ) : user ? (
              <PlanCard
                key={plan.id}
                plan={plan}
                current={activePlan === plan.id}
                loading={pendingPlan === plan.id}
                onChoose={choose}
              />
            ) : (
              <PlanCard key={plan.id} plan={plan} ctaTo="/signup" ctaLabel="Start 3 days free" />
            )
          )}
        </div>
        <p className="mt-8 text-center text-sm text-ink-muted">
          Payments are handled securely by Razorpay. HappiTrack never sees your card details.
        </p>
      </section>
      <MockCheckout checkout={mockCheckout} onPay={payMock} onClose={closeMock} />
    </PublicLayout>
  )
}
