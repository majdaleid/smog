import { useEffect, useState } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import type { Settings, SttEngineName } from '../../../shared/types'

interface SettingsPanelProps {
  settings: Settings
  onSave: (patch: Partial<Settings>) => void
  onClose: () => void
}

const MODELS = ['gpt-4o-mini', 'gpt-4o']

export default function SettingsPanel({
  settings,
  onSave,
  onClose
}: SettingsPanelProps): React.JSX.Element {
  const [openaiApiKey, setKey] = useState(settings.openaiApiKey)
  const [model, setModel] = useState(settings.model)
  const [sttEngine, setSttEngine] = useState<SttEngineName>(settings.sttEngine)
  const [language, setLanguage] = useState(settings.language)
  const [theme, setTheme] = useState<Settings['theme']>(settings.theme)
  const [contextLines, setContextLines] = useState(settings.contextLines)
  const [autoAnswer, setAutoAnswer] = useState(settings.autoAnswer)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function save(): void {
    onSave({ openaiApiKey, model, sttEngine, language, theme, contextLines, autoAnswer })
    onClose()
  }

  const labelCls = 'mb-1 block text-[11px] font-medium text-white/60'
  const inputCls =
    'w-full rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-accent/50'

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="smog-scroll flex max-h-full w-full flex-col overflow-y-auto rounded-2xl border border-white/15 bg-neutral-900/95 p-4 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {/* API key */}
          <div>
            <label className={labelCls}>OpenAI API key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={openaiApiKey}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-…"
                className={`${inputCls} pr-9 font-mono`}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-white/50 hover:text-white"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="mt-1 text-[10px] text-white/40">
              Stored locally on this machine; only sent to OpenAI.
            </p>
          </div>

          {/* Model */}
          <div>
            <label className={labelCls}>Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={`${inputCls} bg-neutral-800`}
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* STT engine */}
          <div>
            <label className={labelCls}>Transcription engine</label>
            <select
              value={sttEngine}
              onChange={(e) => setSttEngine(e.target.value as SttEngineName)}
              className={`${inputCls} bg-neutral-800`}
            >
              <option value="webspeech">Web Speech API (no key)</option>
              <option value="whisper">Whisper API (more accurate)</option>
            </select>
          </div>

          {/* Language + context lines */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Language</label>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={inputCls}
                placeholder="en-US"
              />
            </div>
            <div>
              <label className={labelCls}>Context lines</label>
              <input
                type="number"
                min={1}
                max={200}
                value={contextLines}
                onChange={(e) => setContextLines(Number(e.target.value) || 1)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Auto-answer */}
          <div>
            <label className={labelCls}>Auto-answer spoken questions</label>
            <div className="flex gap-2">
              {([true, false] as const).map((on) => (
                <button
                  key={on ? 'on' : 'off'}
                  type="button"
                  onClick={() => setAutoAnswer(on)}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-xs ${
                    autoAnswer === on
                      ? 'border-accent bg-accent/20 text-white'
                      : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {on ? 'On' : 'Off'}
                </button>
              ))}
            </div>
            <p className="mt-1 text-[10px] text-white/40">
              While listening, detect questions in the transcript and stream an answer on Listen.
            </p>
          </div>

          {/* Theme */}
          <div>
            <label className={labelCls}>Theme</label>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-xs capitalize ${
                    theme === t
                      ? 'border-accent bg-accent/20 text-white'
                      : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-soft"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
