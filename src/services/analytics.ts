import { POSTHOG_KEY } from 'astro:env/client'

import { UTM_KEYS, type UtmTags } from '~/schemas/contact'

const POSTHOG_ENDPOINT = 'https://us.i.posthog.com/i/v0/e/'

type CaptureProperties = Record<
  string,
  string | number | boolean | object | unknown[]
>

async function captureEvent(
  event: string,
  properties: CaptureProperties,
): Promise<void> {
  if (!POSTHOG_KEY) {
    return
  }

  await fetch(POSTHOG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_KEY,
      event,
      distinct_id: crypto.randomUUID(),
      properties,
    }),
  }).catch(() => undefined)
}

export async function captureContactSubmission(utm: UtmTags): Promise<void> {
  const properties: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = utm[key]
    if (value) {
      properties[key] = value
    }
  }

  await captureEvent('contact-submission', properties)
}

export async function captureContactFailure(
  reason: 'resend_error' | 'missing_content',
): Promise<void> {
  await captureEvent('contact-failure', { reason })
}
