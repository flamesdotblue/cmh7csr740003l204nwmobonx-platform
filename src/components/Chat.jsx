import { useEffect, useMemo, useRef, useState } from 'react'
import { Mic, Send, ShieldCheck } from 'lucide-react'

export default function Chat({ t, dir, lang, messages, onSend }) {
  const [input, setInput] = useState('')
  const listRef = useRef(null)
  const liveRef = useRef(null)

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    const last = messages[messages.length - 1]
    if (!last) return
    if (last.role === 'assistant') {
      const region = liveRef.current
      if (region) region.textContent = `New message from assistant.`
    }
  }, [messages])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        onSend(input)
        setInput('')
      }
    }
  }

  const alignmentFor = (role) => {
    const isUser = role === 'user'
    if (dir === 'rtl') {
      return isUser ? 'justify-start' : 'justify-end'
    }
    return isUser ? 'justify-end' : 'justify-start'
  }

  return (
    <div className="flex flex-col">
      <div
        ref={listRef}
        className="mb-3 h-[60vh] w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 sm:p-4"
        role="log"
        aria-live="polite"
      >
        {messages.map((m) => (
          <Message key={m.id} role={m.role} content={m.content} dir={dir} />
        ))}
        <div ref={liveRef} className="sr-only" aria-live="polite" />
      </div>

      <div className="mb-2 text-xs text-slate-600">{t.disclaimer}</div>

      <div className="sticky bottom-2 z-10 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex items-end gap-2">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Start voice input"
          >
            <Mic className="h-5 w-5" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={t.placeholder}
            className="max-h-40 min-h-[44px] flex-1 resize-none rounded-md border border-slate-300 px-3 py-2 text-[15px] leading-relaxed text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={() => {
              if (input.trim()) {
                onSend(input)
                setInput('')
              }
            }}
            disabled={!input.trim()}
            className={`flex h-11 min-w-[88px] items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-700 ${
              input.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-400'
            }`}
          >
            <Send className="h-4 w-4" /> {t.send}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2" aria-label="Quick replies">
          {['Yes', 'No', 'Not sure', 'Add symptom'].map((label) => (
            <button
              key={label}
              onClick={() => onSend(label)}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Message({ role, content, dir }) {
  if (role === 'typing') {
    return (
      <div className={`mb-2 flex ${dir === 'rtl' ? 'justify-end' : 'justify-start'}`}>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
          <span className="inline-flex gap-1">
            <Dot /> <Dot style={{ animationDelay: '120ms' }} /> <Dot style={{ animationDelay: '240ms' }} />
          </span>
          <span className="sr-only">Assistant is typing…</span>
        </div>
      </div>
    )
  }

  const isUser = role === 'user'
  return (
    <div className={`mb-2 flex ${dir === 'rtl' ? (isUser ? 'justify-start' : 'justify-end') : isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          isUser
            ? 'max-w-[80%] rounded-2xl bg-blue-600 px-4 py-3 text-white shadow-sm'
            : 'max-w-[85%] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm'
        }
      >
        {!isUser && (
          <div className="mb-1 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>AI Health Assistant</span>
          </div>
        )}
        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
        <div className={`mt-1 text-[12px] ${isUser ? 'text-blue-100/90' : 'text-slate-500'}`}>{new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(Date.now())}</div>
      </div>
    </div>
  )
}

function Dot(props) {
  return (
    <span
      {...props}
      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-slate-500 motion-reduce:animate-none"
    />
  )
}
