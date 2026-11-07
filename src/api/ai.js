import { api, request } from './client.js'

export const aiApi = {
  conversations: () => api.get('/ai/conversations'),
  deleteConversation: (id) => api.del(`/ai/conversations/${id}`),

  async streamChat({ message, conversationId, signal, onEvent }) {
    const body = conversationId ? { message, conversationId } : { message }
    const res = await request('/ai/chat', { method: 'POST', body, signal, raw: true })
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop()
      for (const chunk of events) {
        const line = chunk.split('\n').find((part) => part.startsWith('data: '))
        if (!line) continue
        try {
          onEvent(JSON.parse(line.slice(6)))
        } catch {
          // ignore malformed event
        }
      }
    }
  }
}
