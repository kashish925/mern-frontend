import { api } from './client.js'

export const authApi = {
  me: () => api.get('/auth/me', { silent401: true }),
  register: (input) => api.post('/auth/register', input, { silent401: true }),
  login: (input) => api.post('/auth/login', input, { silent401: true }),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }, { silent401: true }),
  resetPassword: ({ email, otp, password }) => api.post('/auth/reset-password', { email, otp, password }, { silent401: true }),
  requestPasswordCode: () => api.post('/auth/password/code', {}),
  changePassword: ({ otp, password }) => api.post('/auth/password/change', { otp, password })
}
