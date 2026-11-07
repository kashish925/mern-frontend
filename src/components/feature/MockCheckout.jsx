import { useCallback, useState } from 'react'
import Alert from '../ui/Alert.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import Modal from '../ui/Modal.jsx'

export default function MockCheckout({ checkout, onPay, onClose }) {
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const plan = checkout?.plan

  const close = useCallback(() => {
    if (paying) return
    setError('')
    onClose()
  }, [paying, onClose])

  const pay = async () => {
    setError('')
    setPaying(true)
    try {
      await onPay()
    } catch (err) {
      setError(err.message)
    } finally {
      setPaying(false)
    }
  }

  return (
    <Modal
      open={Boolean(checkout)}
      onClose={close}
      title="Test checkout"
      footer={
        <>
          <Button variant="secondary" onClick={() => setError('Test payment failed. No money was taken. Try again or cancel.')} disabled={paying}>
            Simulate a failed payment
          </Button>
          <Button onClick={pay} loading={paying}>
            Pay ${plan?.price}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Badge tone="warning">Dummy payment · no real money</Badge>
        <div className="rounded-2xl bg-surface-muted p-4">
          <p className="text-base font-extrabold text-ink">{plan?.name}</p>
          <p className="text-ink-muted">
            ${plan?.price} / {plan?.period}
          </p>
        </div>
        <div className="space-y-1.5">
          <p className="font-bold text-ink">Card</p>
          <p className="field select-none tracking-widest text-ink-muted">4111 1111 1111 1111 · 12/30 · 123</p>
          <p className="text-xs text-ink-faint">Test card details. Razorpay is not contacted while dummy payments are on.</p>
        </div>
        {error ? <Alert tone="danger" title={error} /> : null}
      </div>
    </Modal>
  )
}
