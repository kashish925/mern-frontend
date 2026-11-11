import logoMark from '../../assets/logo-mark.png'

function inline(text, keyPrefix) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    /^\*\*[^*]+\*\*$/.test(part) ? (
      <strong key={`${keyPrefix}-${i}`} className="font-extrabold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  )
}

function FormattedReply({ content }) {
  const blocks = []
  let bullets = []
  const flush = () => {
    if (!bullets.length) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-1 list-disc space-y-1 pl-5">
        {bullets.map((item, i) => (
          <li key={i}>{inline(item, `li-${blocks.length}-${i}`)}</li>
        ))}
      </ul>
    )
    bullets = []
  }
  content.split('\n').forEach((raw, i) => {
    const line = raw.replace(/^#{1,6}\s+/, '')
    const bullet = line.match(/^\s*[*\-•]\s+(.*)$/)
    if (bullet) {
      bullets.push(bullet[1])
      return
    }
    flush()
    blocks.push(line.trim() ? <p key={`p-${i}`}>{inline(line, `p-${i}`)}</p> : <div key={`gap-${i}`} className="h-2" />)
  })
  flush()
  return <div className="space-y-1">{blocks}</div>
}

export default function ChatMessage({ role, content, streaming = false, notice = false }) {
  if (notice) {
    return (
      <div className="flex justify-center">
        <p className="max-w-md rounded-2xl bg-surface-muted px-4 py-2 text-center text-sm font-semibold text-ink-muted">{content}</p>
      </div>
    )
  }
  const mine = role === 'user'
  return (
    <div className={`flex items-end gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
      {!mine ? <img src={logoMark} alt="" aria-hidden="true" className="mb-1 h-8 w-auto shrink-0" /> : null}
      <div
        className={`max-w-[85%] rounded-3xl px-4 py-3 text-[15px] leading-relaxed sm:max-w-[70%] ${
          mine ? 'whitespace-pre-wrap rounded-br-lg bg-brand text-white shadow-soft' : 'rounded-bl-lg border border-line bg-surface text-ink'
        }`}
      >
        {mine ? content : <FormattedReply content={content} />}
        {streaming ? <span className="ml-1 inline-block h-4 w-1.5 animate-pulse rounded-full bg-lavender align-middle" aria-hidden="true" /> : null}
      </div>
    </div>
  )
}

export function TypingDots() {
  return (
    <div className="flex items-end gap-2" aria-label="Companion is typing">
      <img src={logoMark} alt="" aria-hidden="true" className="mb-1 h-8 w-auto" />
      <div className="flex gap-1 rounded-3xl rounded-bl-lg border border-line bg-surface px-4 py-4">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-lavender" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </div>
  )
}
