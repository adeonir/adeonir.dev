import { describe, expect, it } from 'vitest'

import {
  hashNarration,
  narrationFile,
  narrationSections,
} from '~/helpers/narration'

describe('narration sections', () => {
  it('lists the narrated sections in page order', () => {
    expect(narrationSections).toEqual(['hero', 'about', 'expertise'])
  })
})

describe('hashNarration', () => {
  it('returns the SHA-256 hex digest', async () => {
    await expect(hashNarration('abc')).resolves.toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })

  it('returns the same hash for the same text', async () => {
    const text = '[short pause] Adeonir Kohl.'

    expect(await hashNarration(text)).toBe(await hashNarration(text))
  })
})

describe('narrationFile', () => {
  it('names the file after the locale, the section, and the spoken text hash', async () => {
    await expect(narrationFile('pt', 'about', 'abc')).resolves.toBe(
      '/narration/pt/about.ba7816bf.mp3',
    )
  })

  it('changes the file name when the spoken text changes', async () => {
    const before = await narrationFile('en', 'hero', 'Adeonir Kohl.')
    const after = await narrationFile(
      'en',
      'hero',
      '[short pause] Adeonir Kohl.',
    )

    expect(after).not.toBe(before)
  })
})
