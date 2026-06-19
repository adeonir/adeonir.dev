import { env } from 'cloudflare:workers'

export async function isRateLimited(ip: string): Promise<boolean> {
  try {
    const { success } = await env.CONTACT_LIMIT.limit({ key: ip || 'unknown' })
    return !success
  } catch {
    return false
  }
}
