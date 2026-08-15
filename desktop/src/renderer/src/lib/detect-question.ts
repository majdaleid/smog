/** Local spoken-question detector. No network — keeps auto-answer latency at STT + one chat stream. */

const MIN_WORDS = 4
const MIN_CHARS = 12

/** Sentence-initial interrogatives and interview-style prompts. */
const INTERROGATIVE =
  /^(who|what|when|where|why|how|which|whose|whom|can|could|would|should|will|do|does|did|is|are|was|were|have|has|had|may|might|explain|tell|describe|walk|compare|define)\b/i

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function wordCount(s: string): number {
  return s.split(/\s+/).filter(Boolean).length
}

function isQuestionSentence(s: string): boolean {
  if (s.length < MIN_CHARS || wordCount(s) < MIN_WORDS) return false
  if (s.endsWith('?')) return true
  return INTERROGATIVE.test(s)
}

export function normalizeQuestion(q: string): string {
  return q
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isNearDuplicate(a: string, b: string): boolean {
  const na = normalizeQuestion(a)
  const nb = normalizeQuestion(b)
  if (!na || !nb) return false
  if (na === nb) return true
  const [shorter, longer] = na.length <= nb.length ? [na, nb] : [nb, na]
  return longer.includes(shorter) && shorter.length / longer.length >= 0.7
}

/**
 * Pull the last real question out of a final transcript chunk, or null.
 * Whisper 7s clips often mix a statement and a question — we split first.
 */
export function detectQuestion(text: string, lastQuestion?: string | null): string | null {
  const cleaned = text.trim()
  if (!cleaned) return null

  let found: string | null = null
  for (const sentence of splitSentences(cleaned)) {
    if (isQuestionSentence(sentence)) found = sentence
  }
  if (!found) return null
  if (lastQuestion && isNearDuplicate(found, lastQuestion)) return null
  return found
}
