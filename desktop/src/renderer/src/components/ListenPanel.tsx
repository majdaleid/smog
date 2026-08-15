import { useEffect, useRef } from 'react'
import { Mic, AudioLines, AlertTriangle } from 'lucide-react'
import type { QAItem, TranscriptItem } from '../lib/types'
import type { SttEngineName } from '../../../shared/types'

interface ListenPanelProps {
  listening: boolean
  interim: string
  transcript: TranscriptItem[]
  error: string | null
  engineName: SttEngineName
  onToggle: () => void
  autoAnswer: boolean
  onToggleAuto: () => void
  hasApiKey: boolean
  liveItem: QAItem | null
  streaming: boolean
  highlightedId?: string
}

function fmtTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ListenPanel({
  listening,
  interim,
  transcript,
  error,
  engineName,
  onToggle,
  autoAnswer,
  onToggleAuto,
  hasApiKey,
  liveItem,
  streaming,
  highlightedId
}: ListenPanelProps): React.JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [transcript, interim])

  const finals = transcript.filter((i) => !i.interim)

  return (
    <div className="flex h-full flex-col">
      {/* Mic control */}
      <div className="flex flex-col items-center gap-2 py-4">
        <button
          type="button"
          onClick={onToggle}
          className={`relative flex h-16 w-16 items-center justify-center rounded-full border transition-all ${
            listening
              ? 'border-accent/60 bg-accent/20 text-accent'
              : 'border-white/20 bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          {listening && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/20" />
          )}
          <span className="relative">{listening ? <AudioLines size={26} /> : <Mic size={26} />}</span>
        </button>
        <div className="text-xs text-white/60">
          {listening ? 'Listening…' : 'Tap to start listening'}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/50">
            {engineName === 'whisper' ? 'Whisper API' : 'Web Speech'}
          </span>
          <button
            type="button"
            onClick={onToggleAuto}
            title={autoAnswer ? 'Auto-answer is on' : 'Auto-answer is off'}
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
              autoAnswer
                ? 'bg-accent/25 text-white'
                : 'bg-white/10 text-white/50 hover:bg-white/15'
            }`}
          >
            Auto
          </button>
        </div>
        {autoAnswer && !hasApiKey && (
          <p className="text-[11px] text-amber-200/80">Add your OpenAI key in Settings to auto-answer.</p>
        )}
      </div>

      {error && (
        <div className="mx-3 mb-2 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Transcript */}
      <div ref={scrollRef} className="smog-scroll flex-1 overflow-y-auto px-4 pb-4">
        {finals.length === 0 && !interim ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-white/40">
            <Mic size={22} className="opacity-50" />
            <p className="text-xs">
              Your live transcript appears here.
              <br />
              Spoken questions are answered below.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {finals.map((item) => (
              <div
                key={item.id}
                className={`text-sm leading-snug ${
                  item.id === highlightedId ? 'rounded-md bg-accent/15 px-1.5 py-0.5' : ''
                }`}
              >
                <span className="mr-2 text-[10px] tabular-nums text-white/40">
                  {fmtTime(item.ts)}
                </span>
                <span className="text-white/90">{item.text}</span>
              </div>
            ))}
            {interim && (
              <div className="italic leading-snug text-white/40">{interim}</div>
            )}
          </div>
        )}
      </div>

      {liveItem && (
        <div className="border-t border-white/10 px-3 py-2.5">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-white/40">
            {streaming ? 'Answering…' : 'Live answer'}
          </div>
          <div className="mb-1.5 text-[11px] text-white/55">{liveItem.question}</div>
          <div className="smog-scroll max-h-36 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-white/90">
            {liveItem.answer || '…'}
          </div>
        </div>
      )}
    </div>
  )
}
