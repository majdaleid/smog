const API_URL = 'https://api.openai.com/v1/chat/completions'

export const SYSTEM_PROMPT =
  'You are a live copilot. Use the provided live transcript as context. Be concise and direct.'

export const AUTO_ANSWER_PROMPT =
  'You are a live interview copilot. Someone just asked the following question aloud. ' +
  'Give a concise spoken-style answer the user can say out loud — short talking points, not an essay. ' +
  'Use the provided live transcript as context. Be direct.'

export interface AskOptions {
  apiKey: string
  model: string
  question: string
  context: string
  signal?: AbortSignal
  /** Override the default Ask system prompt (used for auto-answers). */
  systemPrompt?: string
  onDelta: (token: string) => void
  onDone: () => void
  onError: (message: string) => void
}

export function friendlyError(status: number, body: string): string {
  if (status === 401) return 'Invalid OpenAI API key. Add or update it in Settings.'
  if (status === 429) return 'Rate limited or out of quota on your OpenAI account.'
  return `OpenAI request failed (${status}): ${body.slice(0, 200)}`
}

/**
 * Stream an answer to a question, attaching recent transcript lines as context.
 */
export async function askQuestion(opts: AskOptions): Promise<void> {
  const { apiKey, model, question, context, signal, systemPrompt, onDelta, onDone, onError } = opts

  if (!apiKey) {
    onError('Add your OpenAI API key in Settings to use Ask.')
    return
  }

  const messages = [
    { role: 'system', content: systemPrompt ?? SYSTEM_PROMPT }
  ]
  if (context.trim()) {
    messages.push({ role: 'user', content: `Live transcript (recent):\n${context}` })
  }
  messages.push({ role: 'user', content: question })

  let res: Response
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      signal,
      body: JSON.stringify({ model, messages, stream: true })
    })
  } catch (err) {
    if (signal?.aborted) return
    onError(`Network error: ${err instanceof Error ? err.message : String(err)}`)
    return
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    onError(friendlyError(res.status, body))
    return
  }

  const reader = res.body?.getReader()
  if (!reader) {
    onError('No response stream from OpenAI.')
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // SSE events are separated by blank lines.
      let sep: number
      while ((sep = buffer.indexOf('\n\n')) !== -1) {
        const rawEvent = buffer.slice(0, sep)
        buffer = buffer.slice(sep + 2)
        for (const line of rawEvent.split('\n')) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue
          const data = trimmed.slice(5).trim()
          if (data === '[DONE]') {
            onDone()
            return
          }
          try {
            const json = JSON.parse(data) as {
              choices?: { delta?: { content?: string } }[]
            }
            const token = json.choices?.[0]?.delta?.content
            if (token) onDelta(token)
          } catch {
            // Partial JSON across chunks is handled by the buffer; skip unparseable lines.
          }
        }
      }
    }
    onDone()
  } catch (err) {
    if (signal?.aborted) return
    onError(`Stream error: ${err instanceof Error ? err.message : String(err)}`)
  }
}

/**
 * Non-streaming: summarize a transcript into structured Markdown notes.
 */
export async function generateNotes(opts: {
  apiKey: string
  model: string
  transcript: string
}): Promise<string> {
  const { apiKey, model, transcript } = opts
  if (!apiKey) {
    throw new Error('Add your OpenAI API key in Settings to generate notes.')
  }
  if (!transcript.trim()) {
    throw new Error('Nothing to summarize yet — the transcript is empty.')
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'Summarize the following transcript into structured Markdown notes with sections: ' +
            '## Summary, ## Key Points (bullets), ## Decisions (bullets), ## Action Items (bullets). ' +
            'Return only Markdown.'
        },
        { role: 'user', content: transcript }
      ]
    })
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(friendlyError(res.status, body))
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  return (data.choices?.[0]?.message?.content ?? '').trim()
}
