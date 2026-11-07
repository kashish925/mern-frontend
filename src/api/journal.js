import { api, qs } from './client.js'

export const journalApi = {
  list: (filters) => api.get(`/journal${qs(filters)}`),
  prompts: () => api.get('/journal/prompts'),
  get: (id) => api.get(`/journal/${id}`),
  create: (entry) => api.post('/journal', entry),
  update: (id, changes) => api.put(`/journal/${id}`, changes),
  remove: (id) => api.del(`/journal/${id}`)
}
