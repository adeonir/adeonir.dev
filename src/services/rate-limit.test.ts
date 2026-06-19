import { beforeEach, describe, expect, it, vi } from 'vitest'

const limit = vi.fn()

vi.mock('cloudflare:workers', () => ({
  env: {
    CONTACT_LIMIT: {
      limit: (options: { key: string }) => limit(options),
    },
  },
}))

import { isRateLimited } from '~/services/rate-limit'

describe('isRateLimited', () => {
  beforeEach(() => {
    limit.mockReset()
  })

  it('returns false when the binding allows the request', async () => {
    limit.mockResolvedValue({ success: true })

    await expect(isRateLimited('1.2.3.4')).resolves.toBe(false)
  })

  it('returns true when the binding rejects the request', async () => {
    limit.mockResolvedValue({ success: false })

    await expect(isRateLimited('1.2.3.4')).resolves.toBe(true)
  })

  it('fails open and returns false when the binding throws', async () => {
    limit.mockRejectedValue(new Error('binding unavailable'))

    await expect(isRateLimited('1.2.3.4')).resolves.toBe(false)
  })

  it('falls back to the shared "unknown" key when the IP is absent', async () => {
    limit.mockResolvedValue({ success: true })

    await isRateLimited('')

    expect(limit).toHaveBeenCalledWith({ key: 'unknown' })
  })
})
