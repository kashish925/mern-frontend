import { useCallback, useState } from 'react'
import { billingApi } from '../api/billing.js'
import logoMark from '../assets/logo-mark.png'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { colors } from '../theme/tokens.js'
import { openCheckout } from '../utils/razorpay.js'

export function useCheckout() {
  const { user, refresh } = useAuth()
  const toast = useToast()
  const [pendingPlan, setPendingPlan] = useState(null)
  const [error, setError] = useState('')
  const [mockCheckout, setMockCheckout] = useState(null)

  const activated = async (plan) => {
    await refresh()
    toast.success(`You’re on the ${plan.name} plan. The AI companion and all exercises are unlocked.`)
  }

  const choose = async (plan) => {
    setError('')
    setPendingPlan(plan.id)
    try {
      const sub = await billingApi.subscribe(plan.id)
      if (sub.mock) {
        setMockCheckout({ plan, subscriptionId: sub.subscriptionId })
        return
      }
      await openCheckout({
        keyId: sub.keyId,
        subscriptionId: sub.subscriptionId,
        user,
        image: new URL(logoMark, window.location.origin).href,
        color: colors.primary.DEFAULT,
        onSuccess: async (payment) => {
          try {
            await billingApi.verify(payment)
            await activated(plan)
          } catch (err) {
            setError(err.message)
          } finally {
            setPendingPlan(null)
          }
        },
        onDismiss: () => setPendingPlan(null)
      })
    } catch (err) {
      setPendingPlan(null)
      if (err.status === 503) setError(`Payments aren’t set up yet (${err.message}). Please try again later.`)
      else if (err.status === 409) setError('You already have an active plan.')
      else setError(err.message)
    }
  }

  const payMock = async () => {
    const { plan, subscriptionId } = mockCheckout
    await billingApi.verify({
      razorpay_payment_id: `pay_mock_${Date.now()}`,
      razorpay_subscription_id: subscriptionId,
      razorpay_signature: 'mock'
    })
    setMockCheckout(null)
    setPendingPlan(null)
    await activated(plan)
  }

  const closeMock = useCallback(() => {
    setMockCheckout(null)
    setPendingPlan(null)
  }, [])

  return { choose, pendingPlan, error, mockCheckout, payMock, closeMock }
}
