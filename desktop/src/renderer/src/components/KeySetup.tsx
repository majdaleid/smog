import { useState } from 'react'
import { Eye, EyeOff, KeyRound } from 'lucide-react'

interface KeySetupProps {
  onSave: (openaiApiKey: string) => void
}

export default function KeySetup({ onSave }: KeySetupProps): React.JSX.Element {
  const [key, setKey] = useState('')
  const [showKey, setShowKey] = useState(false)

  function save(): void {
    const trimmed = key.trim()
    if (!trimmed) return
    onSave(trimmed)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-6">
      <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/80">
        <KeyRound size={20} />
      </div>
      <h2 className="text-sm font-semibold text-white">Add your OpenAI key</h2>
      <p className="mt-2 max-w-[260px] text-center text-xs leading-relaxed text-white/55">
        smog uses your OpenAI key. It stays on this machine and is only sent to OpenAI.
      </p>

      <div className="relative mt-4 w-full max-w-[280px]">
        <input
          type={showKey ? 'text' : 'password'}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
          }}
          placeholder="sk-…"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-2.5 py-2 pr-9 font-mono text-xs text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-accent/50"
        />
        <button
          type="button"
          onClick={() => setShowKey((v) => !v)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-white/50 hover:text-white"
        >
          {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={!key.trim()}
        className="mt-3 w-full max-w-[280px] rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
      >
        Save and continue
      </button>

      <a
        href="https://platform.openai.com/api-keys"
        target="_blank"
        rel="noreferrer"
        className="mt-3 text-[11px] text-white/45 underline decoration-white/20 underline-offset-2 hover:text-white/70"
      >
        Get a key from OpenAI
      </a>
    </div>
  )
}
