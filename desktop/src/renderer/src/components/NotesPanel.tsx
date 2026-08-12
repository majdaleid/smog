import { useState } from 'react'
import { Copy, Download, Sparkles, StickyNote } from 'lucide-react'
import { generateNotes } from '../lib/openai'
import { fullTranscript } from '../lib/stt'
import type { TranscriptItem } from '../lib/types'

interface NotesPanelProps {
  transcript: TranscriptItem[]
  apiKey: string
  model: string
}

export default function NotesPanel({
  transcript,
  apiKey,
  model
}: NotesPanelProps): React.JSX.Element {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const finals = transcript.filter((i) => !i.interim)
  const wordCount = notes ? notes.trim().split(/\s+/).length : 0

  async function generate(): Promise<void> {
    setError(null)
    setLoading(true)
    try {
      const md = await generateNotes({ apiKey, model, transcript: fullTranscript(transcript) })
      setNotes(md)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  async function copy(): Promise<void> {
    if (!notes) return
    try {
      await navigator.clipboard.writeText(notes)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setError('Could not copy to clipboard.')
    }
  }

  function download(): void {
    if (!notes) return
    const blob = new Blob([notes], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const d = new Date()
    const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`
    a.download = `smog-notes-${stamp}.md`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-1.5 text-xs text-white/60">
          <StickyNote size={14} />
          <span>{finals.length} transcript lines</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => void copy()}
            disabled={!notes}
            className="flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-white/80 hover:bg-white/10 disabled:opacity-40"
          >
            <Copy size={12} /> {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={download}
            disabled={!notes}
            className="flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-white/80 hover:bg-white/10 disabled:opacity-40"
          >
            <Download size={12} /> .md
          </button>
          <button
            type="button"
            onClick={() => void generate()}
            disabled={loading}
            className="flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-[11px] font-medium text-white hover:bg-accent-soft disabled:opacity-60"
          >
            <Sparkles size={12} /> {loading ? 'Generating…' : notes ? 'Regenerate' : 'Generate'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-3 mt-2 rounded-md border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5 text-[11px] text-amber-100">
          {error}
        </div>
      )}

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={
          finals.length === 0
            ? 'No transcript yet. Use the Listen tab, then come back and Generate notes.'
            : 'Click Generate to turn your transcript into structured Markdown notes. You can edit them here.'
        }
        className="smog-scroll m-3 flex-1 resize-none rounded-lg border border-white/15 bg-white/5 p-3 text-xs leading-relaxed text-white/90 placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-accent/50"
      />

      <div className="px-3 pb-2 text-right text-[10px] text-white/35">
        {wordCount} words
        {!apiKey && <span className="ml-2 text-amber-200/70">OpenAI key required</span>}
      </div>
    </div>
  )
}
