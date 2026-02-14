function isLatinOnly(text) {
  if (!text || typeof text !== 'string') return false
  return /^[\p{Script=Latin}\p{M}' -]+$/u.test(text)
}

function isSafeText(value, maxLength = 80) {
  if (!value || typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > maxLength) return false
  for (let i = 0; i < trimmed.length; i += 1) {
    const code = trimmed.charCodeAt(i)
    if ((code >= 0 && code <= 31) || code === 127) return false
  }
  if (/[{}<>[\]`$\\]/.test(trimmed)) return false
  return true
}

function sanitizeNameItems(items, count) {
  const unique = new Set()
  const cleaned = []

  for (const item of items) {
    let name = String(item?.name || '').trim()
    let nativeName = item?.nativeName ? String(item.nativeName).trim() : null
    const meaning = String(item?.meaning || 'A lovely name').trim()
    const origin = String(item?.origin || 'Various').trim()

    // If name has non-Latin characters and nativeName is Latin, the model swapped them
    if (name && !isLatinOnly(name) && nativeName && isLatinOnly(nativeName)) {
      const temp = name
      name = nativeName
      nativeName = temp
    }

    const dedupeKey = name.toLocaleLowerCase()

    if (!isSafeText(name, 40) || !isSafeText(meaning, 160) || !isSafeText(origin, 40)) continue
    if (unique.has(dedupeKey)) continue

    unique.add(dedupeKey)
    const entry = { name, meaning, origin }
    if (nativeName && isSafeText(nativeName, 40)) {
      entry.nativeName = nativeName
    }
    cleaned.push(entry)
    if (cleaned.length >= count) break
  }

  return cleaned
}

export async function generateNames(gender, style, origin, count = 6) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gender, style, origin, count }),
  })

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || ''
    let message = ''

    if (contentType.includes('application/json')) {
      const errorData = await response.json().catch(() => ({}))
      message = errorData.error || errorData.message || ''
    } else {
      const rawText = await response.text().catch(() => '')
      message = rawText.slice(0, 240).trim()
    }

    if (!message && response.status === 404) {
      message = 'API route not found. If running locally, start with `vercel dev` so `/api/generate` is available.'
    }

    throw new Error(message || `Request failed (${response.status}). Please try again.`)
  }

  const data = await response.json()
  const generatedText = data.generated_text || ''

  const jsonMatch = generatedText.match(/\[[\s\S]*?\]/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) {
        const cleaned = sanitizeNameItems(parsed, count)
        if (cleaned.length > 0) return cleaned
      }
    } catch {
      // JSON parse failed, try fallback
    }
  }

  throw new Error('Could not parse name suggestions. Please try again.')
}
