import { api } from './client.js'

export const onboardingApi = {
  get: () => api.get('/onboarding'),
  save: (answers) => api.post('/onboarding', answers),
  update: (answers) => api.put('/onboarding', answers),
  remove: () => api.del('/onboarding')
}
