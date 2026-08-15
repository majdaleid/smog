/** Renderer-side shared types. */

export interface TranscriptItem {
  id: string
  /** epoch ms */
  ts: number
  text: string
  /** true while a segment is still being refined (not used for finals) */
  interim?: boolean
}

export interface SttStartOptions {
  language: string
  onFinal: (text: string) => void
  onInterim: (text: string) => void
  onError: (msg: string) => void
}

export interface SttEngine {
  start(opts: SttStartOptions): void
  stop(): void
}

export type QASource = 'manual' | 'auto'

export interface QAItem {
  id: string
  question: string
  answer: string
  source: QASource
  /** Transcript line that triggered an auto-answer, if any. */
  transcriptId?: string
}
