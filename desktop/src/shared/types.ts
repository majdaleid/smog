/**
 * Shared types used by the main process, preload and renderer.
 * Type-only module — erased at compile time, so no cross-bundle runtime cost.
 */

export type SttEngineName = 'webspeech' | 'whisper'

export interface Settings {
  /** OpenAI API key. Stored locally, never logged. Empty by default. */
  openaiApiKey: string
  /** Chat model id, e.g. "gpt-4o-mini". */
  model: string
  /** Speech-to-text engine. */
  sttEngine: SttEngineName
  /** BCP-47 language tag, e.g. "en-US". */
  language: string
  /** UI theme. */
  theme: 'dark' | 'light'
  /** How many recent transcript lines to attach as Ask context. */
  contextLines: number
  /** When listening, detect spoken questions and stream an answer on Listen. */
  autoAnswer: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  openaiApiKey: '',
  model: 'gpt-4o-mini',
  sttEngine: 'webspeech',
  language: 'en-US',
  theme: 'dark',
  contextLines: 20,
  autoAnswer: true
}
