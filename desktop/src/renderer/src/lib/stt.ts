import { WebSpeechEngine } from './stt-webspeech'
import { WhisperEngine } from './stt-whisper'
import type { SttEngine, TranscriptItem } from './types'
import type { Settings, SttEngineName } from '../../../shared/types'

/** Build the right engine implementation from settings. */
export function createStt(engine: SttEngineName, settings: Settings): SttEngine {
  if (engine === 'whisper') return new WhisperEngine(settings.openaiApiKey)
  return new WebSpeechEngine()
}

/** Last N final lines joined as context for the Ask panel. */
export function recentContext(items: TranscriptItem[], lines: number): string {
  const finals = items.filter((i) => !i.interim)
  const slice = finals.slice(-Math.max(1, lines))
  return slice.map((i) => i.text).join('\n')
}

/** Whole transcript (finals only) as a single string, for Notes. */
export function fullTranscript(items: TranscriptItem[]): string {
  return items.filter((i) => !i.interim).map((i) => i.text).join('\n')
}
