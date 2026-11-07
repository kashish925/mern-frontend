import { api } from './client.js'

export const exercisesApi = {
  list: () => api.get('/exercises'),
  logSession: (exerciseId, durationSec) => api.post('/exercises/sessions', { exerciseId, durationSec })
}
