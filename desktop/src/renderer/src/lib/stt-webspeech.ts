import type { SttEngine, SttStartOptions } from './types'

const ERROR_HINTS: Record<string, string> = {
  'not-allowed':
    'Microphone permission denied. Grant mic access or switch to the Whisper engine in Settings.',
  'service-not-allowed':
    'Speech service blocked. Grant mic permission or switch to the Whisper engine in Settings.',
  network:
    'Web Speech network error — it relies on a remote Google endpoint and can be unreliable in Electron. Try the Whisper engine in Settings.',
  'audio-capture': 'No microphone found. Connect a mic and try again.'
}

/** Web Speech API engine (default). Continuous + interim results with auto-restart. */
export class WebSpeechEngine implements SttEngine {
  private recognition: SpeechRecognition | null = null
  private opts: SttStartOptions | null = null
  private shouldListen = false

  start(opts: SttStartOptions): void {
    this.opts = opts
    this.shouldListen = true

    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Ctor) {
      opts.onError(
        'Web Speech API is not available in this build. Switch to the Whisper engine in Settings.'
      )
      return
    }

    const rec = new Ctor()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = opts.language || 'en-US'
    rec.maxAlternatives = 1

    rec.onresult = (event: SpeechRecognitionEvent): void => {
      if (!this.opts) return
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0]?.transcript ?? ''
        if (result.isFinal) {
          const trimmed = text.trim()
          if (trimmed) this.opts.onFinal(trimmed)
        } else {
          interim += text
        }
      }
      this.opts.onInterim(interim)
    }

    rec.onerror = (event: SpeechRecognitionErrorEvent): void => {
      if (!this.opts) return
      const err = event.error
      // Benign/transient errors — keep going.
      if (err === 'no-speech' || err === 'aborted') return
      if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
        // Permission/hardware problems: stop retrying.
        this.shouldListen = false
      }
      this.opts.onError(ERROR_HINTS[err] ?? `Speech recognition error: ${err}`)
    }

    rec.onend = (): void => {
      // Web Speech stops itself periodically; restart while still "listening".
      if (this.shouldListen) {
        try {
          rec.start()
        } catch {
          // start() throws if already running — ignore.
        }
      }
    }

    this.recognition = rec
    try {
      rec.start()
    } catch {
      // already started
    }
  }

  stop(): void {
    this.shouldListen = false
    if (this.recognition) {
      try {
        this.recognition.onend = null
        this.recognition.stop()
      } catch {
        // ignore
      }
      this.recognition = null
    }
  }
}
