function parseFallbackText(text, count) {
  const names = []
  const lines = text.split('\n').filter(l => l.trim())

  for (const line of lines) {
    const nameMatch = line.match(/(?:\d+\.\s*)?(?:\*\*)?([\p{L}\p{M}][\p{L}\p{M}\s'-]{0,39})(?:\*\*)?/u)
    if (nameMatch && names.length < count) {
      const meaningMatch = line.match(/(?:meaning|means?)[:\s]+["']?([^"'\n,]+)/i)
      const originMatch = line.match(/(?:origin)[:\s]+["']?([^"'\n,]+)/i)
      names.push({
        name: nameMatch[1].trim(),
        meaning: meaningMatch ? meaningMatch[1].trim() : 'A beautiful name',
        origin: originMatch ? originMatch[1].trim() : 'Various',
      })
    }
  }
  return names
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
    const name = String(item?.name || '').trim()
    const meaning = String(item?.meaning || 'A lovely name').trim()
    const origin = String(item?.origin || 'Various').trim()
    const dedupeKey = name.toLocaleLowerCase()

    if (!isSafeText(name, 40) || !isSafeText(meaning, 160) || !isSafeText(origin, 40)) continue
    if (unique.has(dedupeKey)) continue

    unique.add(dedupeKey)
    cleaned.push({ name, meaning, origin })
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
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Something went wrong. Please try again.`)
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

  const fallback = sanitizeNameItems(parseFallbackText(generatedText, count), count)
  if (fallback.length > 0) return fallback

  throw new Error('Could not parse name suggestions. Please try again.')
}
