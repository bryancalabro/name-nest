const API_URL = 'https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2'

function buildPrompt(gender, style, origin, count) {
  const genderText = gender === 'surprise' ? 'any gender (mix of boy and girl names)' : `a ${gender}`
  const originText = origin === 'any' ? 'any cultural origin' : origin

  return `<s>[INST] You are a baby name expert. Generate exactly ${count} unique baby names for ${genderText}. Style: ${style}. Cultural origin: ${originText}.

For each name, provide the name, its meaning, and cultural origin.

You MUST respond with ONLY a valid JSON array, no other text. Format:
[{"name": "Example", "meaning": "meaning here", "origin": "origin here"}]

Generate exactly ${count} names now: [/INST]`
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

  const prompt = buildPrompt(gender, style, origin, Math.min(Number(count), 10))

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.8,
          top_p: 0.95,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 503) {
        return res.status(503).json({ error: 'The AI model is loading. Please wait a moment and try again.' })
      }
      return res.status(response.status).json({ error: errorData.error || `API error: ${response.status}` })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach the AI service. Please try again.' })
  }
}
