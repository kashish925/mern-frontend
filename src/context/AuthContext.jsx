import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/auth.js'
import { UNAUTHORIZED_EVENT } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState('loading')

  const refresh = useCallback(async () => {
    try {
      const data = await authApi.me()
      setSession(data)
      return data
    } catch {
      setSession(null)
      return null
    } finally {
      setStatus('ready')
    }
  }, [])

  useEffect(() => {
    refresh()
    const onUnauthorized = () => setSession(null)
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [refresh])

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password })
    setSession(data)
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register({ name, email, password })
    setSession(data)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      setSession(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      access: session?.access ?? null,
      onboardingCompleted: Boolean(session?.onboardingCompleted),
      refresh,
      login,
      register,
      logout,
      clear: () => setSession(null)
    }),
    [status, session, refresh, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
