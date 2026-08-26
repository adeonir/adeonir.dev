import { describe, expect, it } from 'vitest'

import {
  contentCollections,
  getLocalizedCollectionName,
  isLocale,
  parseLocale,
} from '~/helpers/content'

describe('content locale mapping', () => {
  it('maps every Portuguese collection to its base name', () => {
    for (const collection of contentCollections) {
      expect(getLocalizedCollectionName(collection, 'pt')).toBe(collection)
    }
  })

  it('maps every English collection to its suffixed name', () => {
    for (const collection of contentCollections) {
      expect(getLocalizedCollectionName(collection, 'en')).toBe(
        `${collection}En`,
      )
    }
  })

  it('maps the language-toggle collection to both locale-specific names', () => {
    expect(getLocalizedCollectionName('languageToggle', 'pt')).toBe(
      'languageToggle',
    )
    expect(getLocalizedCollectionName('languageToggle', 'en')).toBe(
      'languageToggleEn',
    )
  })

  it('recognizes only supported locales', () => {
    expect(isLocale('pt')).toBe(true)
    expect(isLocale('en')).toBe(true)
    expect(isLocale('es')).toBe(false)
  })

  it('rejects an unsupported locale before selecting content', () => {
    expect(() => getLocalizedCollectionName('hero', 'es')).toThrow(
      'Unsupported locale: es',
    )
  })

  it('parses a supported current locale', () => {
    expect(parseLocale('en')).toBe('en')
  })

  it('rejects a missing current locale', () => {
    expect(() => parseLocale(undefined)).toThrow(
      'Unsupported locale: undefined',
    )
  })
})
