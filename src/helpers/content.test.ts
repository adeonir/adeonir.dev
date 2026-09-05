import { describe, expect, it } from 'vitest'

import { isLocale, parseLocale } from '~/helpers/content'

describe('content locale validation', () => {
  it('recognizes only supported locales', () => {
    expect(isLocale('pt')).toBe(true)
    expect(isLocale('en')).toBe(true)
    expect(isLocale('es')).toBe(false)
  })

  it('parses a supported current locale', () => {
    expect(parseLocale('en')).toBe('en')
  })

  it('rejects a missing current locale', () => {
    expect(() => parseLocale(undefined)).toThrow(
      'Unsupported locale: undefined',
    )
  })

  it('rejects an unsupported current locale', () => {
    expect(() => parseLocale('es')).toThrow('Unsupported locale: es')
  })
})
