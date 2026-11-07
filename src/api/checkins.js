import { api, qs } from './client.js'

export const checkinsApi = {
  listMoods: (range) => api.get(`/moods${qs(range)}`),
  logMood: (entry) => api.post('/moods', entry),
  listSleep: (range) => api.get(`/sleep${qs(range)}`),
  logSleep: (entry) => api.post('/sleep', entry)
}
