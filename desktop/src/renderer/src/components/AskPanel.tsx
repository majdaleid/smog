import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, Square } from 'lucide-react'
import type { QAItem } from '../lib/types'

interface AskPanelProps {
  history: QAItem[]
  streaming: boolean
  error: string | null
  apiKey: string
  inputRef: React.RefObject<HTMLTextAreaElement | null>
  onSubmit: (question: string) => void
  onStop: () => void
}

export default function AskPanel({
  history,
  streaming,
  error,
  apiKey,
  inputRef,
  onSubmit,
  onStop
}: AskPanelProps): React.JSX.Element {
  const [question, setQuestion] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history])

  function submit(): void {
    const q = question.trim()
    if (!q) return
    setQuestion('')
    onSubmit(q)
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
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
              Spoken questions also land here.
            </p>
            {!apiKey && (
              <p className="text-[11px] text-amber-200/80">Add your OpenAI key in Settings.</p>
            )}
          </div>
        ) : (
          history.map((it) => (
            <div key={it.id} className="space-y-1.5">
              {it.source === 'auto' && (
                <div className="text-right text-[10px] text-white/40">From transcript</div>
              )}
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
            onClick={onStop}
            title="Stop"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white/80 hover:bg-white/20"
          >
            <Square size={15} />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
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
