import { env } from 'cloudflare:workers'

const WINDOW_TTL = 600
const LIMIT = 5

export async function isRateLimited(ip: string): Promise<boolean> {
  const key = `rl:${ip}`
  const stored = await env.RATE_LIMIT.get(key)
  const count = Number.parseInt(stored ?? '', 10) || 0

  if (count >= LIMIT) {
    return true
  }

  await env.RATE_LIMIT.put(key, String(count + 1), {
    expirationTtl: WINDOW_TTL,
  })
  return false
}
