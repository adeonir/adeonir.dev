import { beforeEach, describe, expect, it, vi } from 'vitest'

const getEntry = vi.hoisted(() => vi.fn())

vi.mock('astro:content', () => ({ getEntry }))

import { getLocalizedEntry } from '~/services/localized'

describe('getLocalizedEntry', () => {
  beforeEach(() => {
    getEntry.mockReset()
  })

  it('resolves the entry matching the requested locale for a given collection', async () => {
    getEntry.mockResolvedValue({ id: 'pt/hero', collection: 'hero', data: {} })

    await getLocalizedEntry('hero', 'pt')

    expect(getEntry).toHaveBeenCalledWith('hero', 'pt/hero')
  })

  it('builds the same locale-slash-collection id for any collection name, with no per-collection lookup', async () => {
    getEntry.mockResolvedValue({
      id: 'en/settings',
      collection: 'settings',
      data: {},
    })

    await getLocalizedEntry('settings', 'en')

    expect(getEntry).toHaveBeenCalledWith('settings', 'en/settings')
  })

  it('throws naming the collection and locale when the entry is missing', async () => {
    getEntry.mockResolvedValue(undefined)

    await expect(getLocalizedEntry('hero', 'en')).rejects.toThrow(
      'Missing localized content: en/hero',
    )
  })
})
