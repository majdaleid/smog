import { useCallback, useEffect, useRef, useState } from 'react'
import { AudioLines, Sparkles, StickyNote } from 'lucide-react'
import Header from './components/Header'
import ListenPanel from './components/ListenPanel'
import AskPanel from './components/AskPanel'
import NotesPanel from './components/NotesPanel'
import KeySetup from './components/KeySetup'
import SettingsPanel from './components/SettingsPanel'
import { detectQuestion } from './lib/detect-question'
import { AUTO_ANSWER_PROMPT, askQuestion } from './lib/openai'
import { createStt, recentContext } from './lib/stt'
import type { QAItem, QASource, SttEngine, TranscriptItem } from './lib/types'
import { DEFAULT_SETTINGS, type Settings } from '../../shared/types'

type Tab = 'listen' | 'ask' | 'notes'

function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function App(): React.JSX.Element {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [settingsReady, setSettingsReady] = useState(false)
  const [tab, setTab] = useState<Tab>('listen')
  const [showSettings, setShowSettings] = useState(false)

  const [transcript, setTranscript] = useState<TranscriptItem[]>([])
  const [interim, setInterim] = useState('')
  const [listening, setListening] = useState(false)
  const [sttError, setSttError] = useState<string | null>(null)

  const [qaHistory, setQaHistory] = useState<QAItem[]>([])
  const [streaming, setStreaming] = useState(false)
  const [askError, setAskError] = useState<string | null>(null)

  const engineRef = useRef<SttEngine | null>(null)
  const askInputRef = useRef<HTMLTextAreaElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const lastQuestionRef = useRef<string | null>(null)
  const askRef = useRef<(question: string, source: QASource, transcriptId?: string) => void>(
    () => undefined
  )

  // Refs that always hold the latest values, so stable callbacks avoid stale closures.
  const settingsRef = useRef<Settings>(settings)
  settingsRef.current = settings
  const listeningRef = useRef<boolean>(listening)
  listeningRef.current = listening
  const transcriptRef = useRef<TranscriptItem[]>(transcript)
  transcriptRef.current = transcript

  // Load persisted settings once.
  useEffect(() => {
    void window.smog.settings.get().then((s: Settings) => {
      settingsRef.current = s
      setSettings(s)
      setSettingsReady(true)
    })
  }, [])

  // Apply theme to <html>.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark')
  }, [settings.theme])

  const ask = useCallback((question: string, source: QASource, transcriptId?: string): void => {
    const q = question.trim()
    if (!q) return

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const id = uid()
    lastQuestionRef.current = q
    setAskError(null)
    setQaHistory((h) => [...h, { id, question: q, answer: '', source, transcriptId }])
    setStreaming(true)

    const s = settingsRef.current
    const context = recentContext(transcriptRef.current, s.contextLines)

    void askQuestion({
      apiKey: s.openaiApiKey,
      model: s.model,
      question: q,
      context,
      signal: controller.signal,
      systemPrompt: source === 'auto' ? AUTO_ANSWER_PROMPT : undefined,
      onDelta: (tok) =>
        setQaHistory((h) => h.map((it) => (it.id === id ? { ...it, answer: it.answer + tok } : it))),
      onDone: () => {
        if (abortRef.current === controller) {
          setStreaming(false)
          abortRef.current = null
        }
      },
      onError: (msg) => {
        if (abortRef.current === controller) {
          setAskError(msg)
          setStreaming(false)
          abortRef.current = null
        }
      }
    })
  }, [])
  askRef.current = ask

  const stopAsk = useCallback((): void => {
    abortRef.current?.abort()
    abortRef.current = null
    setStreaming(false)
  }, [])

  const startEngine = useCallback((): void => {
    const s = settingsRef.current
    setSttError(null)
    const engine = createStt(s.sttEngine, s)
    engineRef.current = engine
    engine.start({
      language: s.language,
      onFinal: (text: string) => {
        const item: TranscriptItem = { id: uid(), ts: Date.now(), text }
        setTranscript((prev) => [...prev, item])
        setInterim('')
        const cur = settingsRef.current
        if (!cur.autoAnswer || !cur.openaiApiKey) return
        const q = detectQuestion(text, lastQuestionRef.current)
        if (q) askRef.current(q, 'auto', item.id)
      },
      onInterim: (text: string) => setInterim(text),
      onError: (msg: string) => setSttError(msg)
    })
    setListening(true)
  }, [])

  const stopEngine = useCallback((): void => {
    engineRef.current?.stop()
    engineRef.current = null
    setListening(false)
    setInterim('')
  }, [])

  const toggleListen = useCallback((): void => {
    if (listeningRef.current || engineRef.current) stopEngine()
    else startEngine()
  }, [startEngine, stopEngine])

  // Subscribe to global shortcuts + tray.
  useEffect(() => {
    window.smog.onShortcut((name) => {
      if (name === 'ask') {
        setTab('ask')
        window.setTimeout(() => askInputRef.current?.focus(), 40)
      } else if (name === 'listen') {
        toggleListen()
      }
    })
    window.smog.onOpenSettings(() => setShowSettings(true))
  }, [toggleListen])

  // Persist a settings patch and react to STT-affecting changes.
  const saveSettings = useCallback(
    (patch: Partial<Settings>): void => {
      const next: Settings = { ...settingsRef.current, ...patch }
      settingsRef.current = next
      setSettings(next)
      void window.smog.settings.set(patch)
      const affectsStt = patch.sttEngine !== undefined || patch.language !== undefined
      if (affectsStt && listeningRef.current) {
        stopEngine()
        startEngine()
      }
    },
    [startEngine, stopEngine]
  )

  const liveItem = qaHistory.length > 0 ? qaHistory[qaHistory.length - 1] : null
  const highlightedId = liveItem?.source === 'auto' ? liveItem.transcriptId : undefined

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'listen', label: 'Listen', icon: <AudioLines size={15} /> },
    { id: 'ask', label: 'Ask', icon: <Sparkles size={15} /> },
    { id: 'notes', label: 'Notes', icon: <StickyNote size={15} /> }
  ]

  const needsKey = settingsReady && !settings.openaiApiKey.trim()

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-2xl dark:bg-black/30">
      <Header
        onCollapse={() => void window.smog.window.hide()}
        onSettings={() => setShowSettings(true)}
        onClose={() => void window.smog.app.quit()}
      />

      {!settingsReady ? (
        <div className="flex-1" />
      ) : needsKey ? (
        <KeySetup onSave={(openaiApiKey) => saveSettings({ openaiApiKey })} />
      ) : (
        <>
          {/* Tab bar */}
          <div className="flex items-center gap-1 px-2 pb-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-white/15 text-white'
                    : 'text-white/55 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Active panel */}
          <div className="flex min-h-0 flex-1 flex-col">
            {tab === 'listen' && (
              <ListenPanel
                listening={listening}
                interim={interim}
                transcript={transcript}
                error={sttError}
                engineName={settings.sttEngine}
                onToggle={toggleListen}
                autoAnswer={settings.autoAnswer}
                onToggleAuto={() => saveSettings({ autoAnswer: !settingsRef.current.autoAnswer })}
                hasApiKey={Boolean(settings.openaiApiKey)}
                liveItem={liveItem}
                streaming={streaming}
                highlightedId={highlightedId}
              />
            )}
            {tab === 'ask' && (
              <AskPanel
                history={qaHistory}
                streaming={streaming}
                error={askError}
                apiKey={settings.openaiApiKey}
                inputRef={askInputRef}
                onSubmit={(q) => ask(q, 'manual')}
                onStop={stopAsk}
              />
            )}
            {tab === 'notes' && (
              <NotesPanel
                transcript={transcript}
                apiKey={settings.openaiApiKey}
                model={settings.model}
              />
            )}
          </div>
        </>
      )}

      {/* Status footer */}
      <div className="flex items-center justify-between border-t border-white/10 px-3 py-1.5 text-[10px] text-white/45">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full ${
              listening ? 'bg-accent' : 'bg-white/30'
            }`}
          />
          {listening ? 'Listening' : 'Idle'}
          <span className="ml-1 opacity-60">
            · {settings.sttEngine === 'whisper' ? 'Whisper' : 'Web Speech'}
          </span>
          {settings.autoAnswer && (
            <span className="ml-1 opacity-60">· Auto</span>
          )}
        </div>
        <div className="opacity-70">Ctrl+Shift+A · Ctrl+Shift+L</div>
      </div>

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
