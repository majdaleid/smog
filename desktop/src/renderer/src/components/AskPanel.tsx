import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, Square } from 'lucide-react'
import { askQuestion } from '../lib/openai'
import { recentContext } from '../lib/stt'
import type { TranscriptItem } from '../lib/types'

interface QAItem {
  id: string
  question: string
  answer: string
}

interface AskPanelProps {
  transcript: TranscriptItem[]
  contextLines: number
  apiKey: string
  model: string
  inputRef: React.RefObject<HTMLTextAreaElement | null>
}

function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function AskPanel({
  transcript,
  contextLines,
  apiKey,
  model,
  inputRef
}: AskPanelProps): React.JSX.Element {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState<QAItem[]>([])
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history])

  async function submit(): Promise<void> {
    const q = question.trim()
    if (!q || streaming) return
    setError(null)
    setQuestion('')
    const id = uid()
    setHistory((h) => [...h, { id, question: q, answer: '' }])
    setStreaming(true)
    const controller = new AbortController()
    abortRef.current = controller
    const context = recentContext(transcript, contextLines)

    await askQuestion({
      apiKey,
      model,
      question: q,
      context,
      signal: controller.signal,
      onDelta: (tok) =>
        setHistory((h) =>
          h.map((it) => (it.id === id ? { ...it, answer: it.answer + tok } : it))
        ),
      onDone: () => {
        setStreaming(false)
        abortRef.current = null
      },
      onError: (msg) => {
        setError(msg)
        setStreaming(false)
        abortRef.current = null
      }
    })
  }

  function stop(): void {
    abortRef.current?.abort()
    abortRef.current = null
    setStreaming(false)
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void submit()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="smog-scroll flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {history.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-white/40">
            <Sparkles size={22} className="opacity-50" />
            <p className="max-w-[220px] text-xs">
              Ask anything. smog attaches your recent transcript as context and streams the answer.
            </p>
            {!apiKey && (
              <p className="text-[11px] text-amber-200/80">Add your OpenAI key in Settings.</p>
            )}
          </div>
        ) : (
          history.map((it) => (
            <div key={it.id} className="space-y-1.5">
              <div className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-accent/25 px-2.5 py-1.5 text-xs text-white">
                {it.question}
              </div>
              <div className="max-w-[90%] whitespace-pre-wrap rounded-lg rounded-bl-sm bg-white/10 px-2.5 py-1.5 text-xs leading-relaxed text-white/90">
                {it.answer || '…'}
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="mx-3 mb-1 rounded-md border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5 text-[11px] text-amber-100">
          {error}
        </div>
      )}

      <div className="flex items-end gap-2 border-t border-white/10 p-2.5">
        <textarea
          ref={inputRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onKey}
          rows={2}
          placeholder="Ask a question…  (Enter to send)"
          className="smog-scroll max-h-28 min-h-[44px] flex-1 resize-none rounded-lg border border-white/15 bg-white/5 px-2.5 py-2 text-xs text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-accent/50"
        />
        {streaming ? (
          <button
            type="button"
            onClick={stop}
            title="Stop"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white/80 hover:bg-white/20"
          >
            <Square size={15} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void submit()}
            disabled={!question.trim()}
            title="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
