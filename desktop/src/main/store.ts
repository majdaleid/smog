import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { DEFAULT_SETTINGS, type Settings } from '../shared/types'

const SETTINGS_FILE = (): string => join(app.getPath('userData'), 'settings.json')

/** Deep-ish merge: only known keys from defaults are kept, patch overrides. */
function coerce(raw: unknown): Settings {
  const out: Settings = { ...DEFAULT_SETTINGS }
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>
    if (typeof r['openaiApiKey'] === 'string') out.openaiApiKey = r['openaiApiKey']
    if (typeof r['model'] === 'string' && r['model']) out.model = r['model']
    if (r['sttEngine'] === 'webspeech' || r['sttEngine'] === 'whisper') {
      out.sttEngine = r['sttEngine']
    }
    if (typeof r['language'] === 'string' && r['language']) out.language = r['language']
    if (r['theme'] === 'dark' || r['theme'] === 'light') out.theme = r['theme']
    if (typeof r['contextLines'] === 'number' && Number.isFinite(r['contextLines'])) {
      out.contextLines = Math.max(1, Math.min(200, Math.floor(r['contextLines'])))
    }
    if (typeof r['autoAnswer'] === 'boolean') out.autoAnswer = r['autoAnswer']
  }
  return out
}

let cache: Settings | null = null

export function getSettings(): Settings {
  if (cache) return cache
  try {
    const text = readFileSync(SETTINGS_FILE(), 'utf8')
    cache = coerce(JSON.parse(text))
  } catch {
    // Missing or corrupt file -> fall back to defaults (never throw).
    cache = { ...DEFAULT_SETTINGS }
  }
  return cache
}

export function setSettings(patch: Partial<Settings>): Settings {
  const merged: Settings = { ...getSettings(), ...patch }
  // Re-coerce to validate types after a user patch.
  cache = coerce(merged)
  try {
    mkdirSync(app.getPath('userData'), { recursive: true })
    writeFileSync(SETTINGS_FILE(), JSON.stringify(cache, null, 2), 'utf8')
  } catch (err) {
    // Best-effort persistence; the in-memory cache is still returned.
    console.error('Failed to persist settings:', err instanceof Error ? err.message : err)
  }
  // Never surface the key in logs.
  return cache
}
