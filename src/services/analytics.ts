import { POSTHOG_KEY } from 'astro:env/client'

const POSTHOG_ENDPOINT = 'https://us.i.posthog.com/i/v0/e/'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const

export async function captureContactSubmission(url: URL): Promise<void> {
  if (!POSTHOG_KEY) {
    return
  }

  const properties: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key)
    if (value) {
      properties[key] = value
    }
  }

  await fetch(POSTHOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event: 'contact-submission',
      distinct_id: crypto.randomUUID(),
      properties,
    }),
  }).catch(() => undefined)
}
