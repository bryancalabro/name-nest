const API_URL = 'https://router.huggingface.co/v1/chat/completions'

function buildMessages(gender, style, origin, count) {
  const genderText = gender === 'surprise' ? 'any gender (mix of boy and girl names)' : `a ${gender}`
  const originText = origin === 'any' ? 'any cultural origin' : origin

  return [
    {
      role: 'system',
      content: 'You are a baby name expert. You always respond with ONLY a valid JSON array, no other text.',
    },
    {
      role: 'user',
      content: `Generate exactly ${count} unique baby names for ${genderText}. Style: ${style}. Cultural origin: ${originText}.

For each name, provide the name, its meaning, and cultural origin.

Respond with ONLY a JSON array in this exact format, nothing else:
[{"name": "Example", "meaning": "meaning here", "origin": "origin here"}]`,
    },
  ]
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.HF_API_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'API token not configured on server.' })
  }

  const { gender, style, origin, count } = req.body
  if (!gender || !style || !origin || !count) {
    return res.status(400).json({ error: 'Missing required fields.' })
  }

  const messages = buildMessages(gender, style, origin, Math.min(Number(count), 10))

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-Instruct-v0.3',
        messages,
        max_tokens: 800,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 503) {
        return res.status(503).json({ error: 'The AI model is loading. Please wait a moment and try again.' })
      }
      return res.status(response.status).json({ error: errorData.error || errorData.message || `API error: ${response.status}` })
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''
    return res.status(200).json({ generated_text: text })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach the AI service. Please try again.' })
  }
}
