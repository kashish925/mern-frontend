import { api } from './client.js'

export const accountApi = {
  deleteAccount: () => api.del('/account')
}
