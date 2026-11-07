import { useCallback, useEffect, useRef, useState } from 'react'

export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const loaderRef = useRef(loader)
  const latestCall = useRef(0)
  loaderRef.current = loader

  const reload = useCallback(async () => {
    const callId = ++latestCall.current
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await loaderRef.current()
      if (callId === latestCall.current) setState({ data, error: null, loading: false })
      return data
    } catch (error) {
      if (callId === latestCall.current) setState({ data: null, error, loading: false })
      return null
    }
  }, [])

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ...state, reload, setData: (data) => setState((prev) => ({ ...prev, data })) }
}
