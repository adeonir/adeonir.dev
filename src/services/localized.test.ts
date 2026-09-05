import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getCollection, getEntry } from '~/test-utils/mock-astro-content'

vi.mock('astro:content', () => ({ getCollection, getEntry }))

import { getLocalizedEntry } from '~/services/localized'

describe('getLocalizedEntry', () => {
  beforeEach(() => {
    getEntry.mockReset()
  })

  it('resolves the entry matching the requested locale for a given collection', async () => {
    getEntry.mockResolvedValue({
      id: 'pt/homeHero',
      collection: 'homeHero',
      data: {},
    })

    await getLocalizedEntry('homeHero', 'pt')

    expect(getEntry).toHaveBeenCalledWith('homeHero', 'pt/homeHero')
  })

  it('builds the same locale-slash-collection id for any collection name, with no per-collection lookup', async () => {
    getEntry.mockResolvedValue({
      id: 'en/sharedSettings',
      collection: 'sharedSettings',
      data: {},
    })

    await getLocalizedEntry('sharedSettings', 'en')

    expect(getEntry).toHaveBeenCalledWith('sharedSettings', 'en/sharedSettings')
  })

  it('throws naming the collection and locale when the entry is missing', async () => {
    getEntry.mockResolvedValue(undefined)

    await expect(getLocalizedEntry('homeHero', 'en')).rejects.toThrow(
      'Missing localized content: en/homeHero',
    )
  })
})
