import { api, qs } from './client.js'

export const insightsApi = {
  get: (range = 7) => api.get(`/insights${qs({ range })}`)
}
