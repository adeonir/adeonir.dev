import { POSTHOG_KEY } from 'astro:env/client'

import { UTM_KEYS, type UtmTags } from '~/schemas/contact'

const POSTHOG_ENDPOINT = 'https://us.i.posthog.com/i/v0/e/'

export async function captureContactSubmission(utm: UtmTags): Promise<void> {
  if (!POSTHOG_KEY) {
    return
  }

  const properties: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = utm[key]
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
