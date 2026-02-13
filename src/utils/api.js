function parseFallbackText(text, count) {
  const names = []
  const lines = text.split('\n').filter(l => l.trim())

  for (const line of lines) {
    const nameMatch = line.match(/(?:\d+\.\s*)?(?:\*\*)?([A-Z][a-z]+)(?:\*\*)?/)
    if (nameMatch && names.length < count) {
      const meaningMatch = line.match(/(?:meaning|means?)[:\s]+["']?([^"'\n,]+)/i)
      const originMatch = line.match(/(?:origin)[:\s]+["']?([^"'\n,]+)/i)
      names.push({
        name: nameMatch[1],
        meaning: meaningMatch ? meaningMatch[1].trim() : 'A beautiful name',
        origin: originMatch ? originMatch[1].trim() : 'Various',
      })
    }
  }
  return names
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
  const generatedText = data[0]?.generated_text || ''

  const jsonMatch = generatedText.match(/\[[\s\S]*?\]/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
        return parsed.slice(0, count).map(item => ({
          name: String(item.name || '').trim(),
          meaning: String(item.meaning || 'A lovely name').trim(),
          origin: String(item.origin || 'Various').trim(),
        }))
      }
    } catch {
      // JSON parse failed, try fallback
    }
  }

  const fallback = parseFallbackText(generatedText, count)
  if (fallback.length > 0) return fallback

  throw new Error('Could not parse name suggestions. Please try again.')
}
