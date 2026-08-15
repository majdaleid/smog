import type { SttEngine, SttStartOptions } from './types'

const CHUNK_MS = 7000
const API_URL = 'https://api.openai.com/v1/audio/transcriptions'

/** Whisper wants ISO-639-1 (`en`); settings store BCP-47 (`en-US`) for Web Speech. */
function toWhisperLanguage(tag: string): string {
  return tag.trim().split(/[-_]/)[0]?.toLowerCase() ?? ''
}

function pickMime(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4'
  ]
  for (const c of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(c)) return c
  }
  return ''
}

function extFor(mime: string): string {
  if (mime.includes('webm')) return 'webm'
  if (mime.includes('ogg')) return 'ogg'
  if (mime.includes('mp4')) return 'mp4'
  return 'bin'
}

/**
 * Whisper engine: captures mic audio with MediaRecorder in fixed-length clips,
 * POSTs each clip to the OpenAI transcription endpoint, and appends the text.
 */
export class WhisperEngine implements SttEngine {
  private apiKey: string
  private stream: MediaStream | null = null
  private recorder: MediaRecorder | null = null
  private opts: SttStartOptions | null = null
  private timer: number | null = null
  private stopped = true

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async start(opts: SttStartOptions): Promise<void> {
    this.opts = opts
    this.stopped = false

    if (!this.apiKey) {
      opts.onError('Add your OpenAI API key in Settings to use the Whisper engine.')
      return
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      opts.onError('Microphone permission denied. Grant mic access to use the Whisper engine.')
      return
    }

    opts.onInterim('(listening…)')
    this.startChunk()
  }

  private startChunk(): void {
    if (this.stopped || !this.stream || !this.opts) return

    const mime = pickMime()
    const rec = new MediaRecorder(this.stream, mime ? { mimeType: mime } : undefined)
    const ext = extFor(mime)
    this.recorder = rec

    rec.ondataavailable = (e: BlobEvent): void => {
      if (e.data && e.data.size > 0) {
        void this.transcribe(e.data, ext)
      }
    }
    rec.onstop = (): void => {
      if (!this.stopped) this.startChunk()
    }

    rec.start()
    this.timer = window.setTimeout(() => {
      if (rec.state === 'recording') {
        try {
          rec.stop()
        } catch {
          // ignore
        }
      }
    }, CHUNK_MS)
  }

  private async transcribe(blob: Blob, ext: string): Promise<void> {
    if (!this.opts) return
    this.opts.onInterim('(transcribing…)')
    const form = new FormData()
    form.append('file', blob, `chunk.${ext}`)
    form.append('model', 'whisper-1')
    form.append('response_format', 'json')
    const lang = toWhisperLanguage(this.opts.language)
    if (lang) form.append('language', lang)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}` },
        body: form
      })
      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        if (res.status === 401) {
          this.opts.onError('Invalid OpenAI API key. Update it in Settings.')
        } else {
          this.opts.onError(`Whisper error (${res.status}): ${detail.slice(0, 200)}`)
        }
        return
      }
      const data = (await res.json()) as { text?: string }
      const text = (data.text ?? '').trim()
      if (text && !this.stopped) {
        this.opts.onFinal(text)
        this.opts.onInterim('(listening…)')
      }
    } catch (err) {
      this.opts.onError(
        `Whisper request failed: ${err instanceof Error ? err.message : String(err)}`
      )
    }
  }

  stop(): void {
    this.stopped = true
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.recorder && this.recorder.state !== 'inactive') {
      try {
        this.recorder.onstop = null
        this.recorder.stop()
      } catch {
        // ignore
      }
    }
    this.recorder = null
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop())
      this.stream = null
    }
  }
}
