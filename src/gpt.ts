export interface Question {
  type: 'question'
  text: string
}

export interface Answer {
  type: 'answer'
  text: string
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface StreamCallbacks {
  onToken: (token: string) => void
  onDone: (fullText: string) => void
  onError: (error: string) => void
}

let conversationHistory: ChatMessage[] = []

export function clearHistory() {
  conversationHistory = []
}

/**
 * Send a message to any OpenAI-compatible API with streaming support.
 */
export async function streamGPTAnswer(
  question: string,
  config: { apiKey: string; baseUrl: string; model: string },
  callbacks: StreamCallbacks
) {
  if (!config.apiKey) {
    callbacks.onError('Please set your API Key first. Press ArrowDown to go to Settings.')
    return
  }

  conversationHistory.push({ role: 'user', content: question })

  const url = `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`
  const body = {
    model: config.model,
    messages: conversationHistory,
    stream: true,
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText)
      const msg = `API Error (${response.status}): ${errText.slice(0, 200)}`
      callbacks.onError(msg)
      conversationHistory.pop() // Remove the failed user message
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      callbacks.onError('No response body received.')
      conversationHistory.pop()
      return
    }

    const decoder = new TextDecoder()
    let fullText = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // Keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const data = trimmed.slice(6)
        if (data === '[DONE]') continue

        try {
          const parsed = JSON.parse(data)
          const token = parsed.choices?.[0]?.delta?.content
          if (token) {
            fullText += token
            callbacks.onToken(token)
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }

    conversationHistory.push({ role: 'assistant', content: fullText })
    callbacks.onDone(fullText)
  } catch (error: any) {
    const msg = error?.message || 'Network error, please try again.'
    callbacks.onError(msg)
    conversationHistory.pop()
  }
}

/**
 * Non-streaming fallback for APIs that don't support streaming.
 */
export async function getGPTAnswer(
  question: Question,
  config: { apiKey: string; baseUrl: string; model: string }
): Promise<Answer> {
  const answer: Answer = { type: 'answer', text: '' }

  if (!config.apiKey) {
    answer.text = 'Please set your API Key first. Press ArrowDown to go to Settings.'
    return answer
  }

  conversationHistory.push({ role: 'user', content: question.text })

  const url = `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: conversationHistory,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText)
      answer.text = `API Error (${response.status}): ${errText.slice(0, 200)}`
      conversationHistory.pop()
      return answer
    }

    const data = await response.json()
    answer.text = data.choices?.[0]?.message?.content || 'No response received.'
    conversationHistory.push({ role: 'assistant', content: answer.text })
  } catch (error: any) {
    answer.text = error?.message || 'Network error, please try again.'
    conversationHistory.pop()
  }

  return answer
}
