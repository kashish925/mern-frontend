import { api } from './client.js'

export const billingApi = {
  status: () => api.get('/billing/status'),
  subscribe: (plan) => api.post('/billing/subscribe', { plan }),
  verify: (payment) => api.post('/billing/verify', payment),
  cancel: () => api.post('/billing/cancel')
}
