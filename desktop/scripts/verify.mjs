#!/usr/bin/env node
/**
 * smog — backend verification.
 *
 * Exercises the SAME OpenAI requests the desktop app makes (Ask streaming + Notes),
 * using the key already saved in the app's local settings (or OPENAI_API_KEY).
 * No mic, no GUI required — this proves the AI plumbing works with your key + model.
 *
 *   node scripts/verify.mjs
 *   OPENAI_API_KEY=sk-... node scripts/verify.mjs      # override key
 *   SMOG_MODEL=gpt-5.6-luna node scripts/verify.mjs    # override model
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const API = 'https://api.openai.com/v1/chat/completions'

// These mirror src/renderer/src/lib/openai.ts exactly.
const SYSTEM_PROMPT =
  'You are a live copilot. Use the provided live transcript as context. Be concise and direct.'
const NOTES_PROMPT =
  'Summarize the following transcript into structured Markdown notes with sections: ' +
  '## Summary, ## Key Points (bullets), ## Decisions (bullets), ## Action Items (bullets). ' +
  'Return only Markdown.'

// A reproducible "mock interview" transcript used as context.
const SAMPLE_TRANSCRIPT = [
  'Interviewer: Welcome. Can you explain the difference between let and const in JavaScript?',
  'Candidate: Both are block-scoped. let can be reassigned, const cannot be reassigned.',
  'Interviewer: Good. Last question — how would you optimize a slow database query?',
  'Candidate: I would start by reading the execution plan, then add appropriate indexes.'
].join('\n')

function settingsPath() {
  if (process.env.SMOG_SETTINGS) return process.env.SMOG_SETTINGS
  const home = os.homedir()
  if (process.platform === 'win32') {
    return path.join(process.env.APPDATA || path.join(home, 'AppData', 'Roaming'), 'desktop', 'settings.json')
  }
  if (process.platform === 'darwin') {
    return path.join(home, 'Library', 'Application Support', 'desktop', 'settings.json')
  }
  return path.join(process.env.XDG_CONFIG_HOME || path.join(home, '.config'), 'desktop', 'settings.json')
}

function loadConfig() {
  if (process.env.OPENAI_API_KEY) {
    return { key: process.env.OPENAI_API_KEY, model: process.env.SMOG_MODEL || 'gpt-4o-mini' }
  }
  let raw = {}
  try {
    raw = JSON.parse(fs.readFileSync(settingsPath(), 'utf8'))
  } catch {
    raw = {}
  }
  return { key: raw.openaiApiKey || '', model: process.env.SMOG_MODEL || raw.model || 'gpt-4o-mini' }
}

async function streamChat({ key, model, messages, onToken }) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, stream: true })
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let sep
    while ((sep = buffer.indexOf('\n\n')) !== -1) {
      const event = buffer.slice(0, sep)
      buffer = buffer.slice(sep + 2)
      for (const line of event.split('\n')) {
        const t = line.trim()
        if (!t.startsWith('data:')) continue
        const data = t.slice(5).trim()
        if (data === '[DONE]') return full
        try {
          const token = JSON.parse(data).choices?.[0]?.delta?.content
          if (token) {
            full += token
            onToken?.(token)
          }
        } catch {
          /* partial JSON across chunks — ignore */
        }
      }
    }
  }
  return full
}

async function chatOnce({ key, model, messages }) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages })
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return (await res.json()).choices?.[0]?.message?.content?.trim() || ''
}

const log = (m) => console.log(m)
const ok = (m) => console.log(`  \u001b[32m✓\u001b[0m ${m}`)
const bad = (m) => console.log(`  \u001b[31m✗\u001b[0m ${m}`)

const { key, model } = loadConfig()
log('\nsmog backend verification')
log(`model: ${model}`)
if (!key) {
  console.error('\nNo API key found. Run the app once and save a key in Settings, or set OPENAI_API_KEY.')
  process.exit(1)
}
log(`key:   ${key.slice(0, 8)}…${key.slice(-4)}`)

let failures = 0

// --- Step 1: Ask (streaming, context-aware) ---
try {
  log('\n[1/2] Ask — streaming answer with transcript context')
  let firstMs = null
  const t0 = Date.now()
  const answer = await streamChat({
    key,
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Live transcript (recent):\n${SAMPLE_TRANSCRIPT}` },
      { role: 'user', content: 'In one sentence, what technical topic was just discussed?' }
    ],
    onToken: (tok) => {
      if (firstMs === null) {
        firstMs = Date.now() - t0
        process.stdout.write(`  streaming (first token ${firstMs}ms): "`)
      }
      process.stdout.write(tok)
    }
  })
  process.stdout.write('"\n')
  if (!answer) throw new Error('empty answer')
  if (/let|const|javascript|query|index|scope/i.test(answer)) {
    ok(`answer references the transcript context (${answer.length} chars)`)
  } else {
    ok(`got a streamed answer (${answer.length} chars) — relevance not auto-detected, eyeball it`)
  }
} catch (e) {
  bad(e.message)
  failures++
}

// --- Step 2: Notes (structured Markdown) ---
try {
  log('\n[2/2] Notes — structured Markdown summary')
  const md = await chatOnce({
    key,
    model,
    messages: [{ role: 'system', content: NOTES_PROMPT }, { role: 'user', content: SAMPLE_TRANSCRIPT }]
  })
  console.log('  ' + md.split('\n').slice(0, 7).join('\n  '))
  if (md.length > 40 && /##|summary|key points|action|decision/i.test(md)) {
    ok(`structured notes generated (${md.length} chars)`)
  } else {
    throw new Error('notes did not look structured')
  }
} catch (e) {
  bad(e.message)
  failures++
}

log('')
if (failures === 0) {
  console.log('\u001b[32m🎉 All backend checks passed — Ask + Notes work with your key/model.\u001b[0m')
  process.exit(0)
}
console.log(`\u001b[33m⚠ ${failures} check(s) failed.\u001b[0m`)
process.exit(1)
