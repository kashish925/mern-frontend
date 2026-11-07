const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'
let loading = null

export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      script.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Checkout did not load')))
      script.onerror = () => {
        loading = null
        reject(new Error('Could not load Razorpay Checkout. Check your connection and try again.'))
      }
      document.body.appendChild(script)
    })
  }
  return loading
}

export async function openCheckout({ keyId, subscriptionId, user, image, color, onSuccess, onDismiss }) {
  const Razorpay = await loadRazorpay()
  const checkout = new Razorpay({
    key: keyId,
    subscription_id: subscriptionId,
    name: 'HappiTrack',
    description: 'HappiTrack subscription',
    image,
    prefill: { name: user?.name, email: user?.email },
    theme: { color },
    handler: onSuccess,
    modal: { ondismiss: onDismiss }
  })
  checkout.open()
}
