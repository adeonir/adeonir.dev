import { describe, expect, it } from 'vitest'

import { cn } from '~/helpers/classnames'

describe('cn', () => {
  it('resolves conflicting utilities to the last supplied one', () => {
    expect(cn('px-5', 'px-8')).toBe('px-8')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('preserves order for non-conflicting classes', () => {
    expect(cn('px-5', 'py-2', 'text-sm')).toBe('px-5 py-2 text-sm')
  })

  it('omits falsy and conditional inputs', () => {
    const disabled = false
    expect(cn('px-5', disabled && 'py-2', undefined, null, 'text-sm')).toBe(
      'px-5 text-sm',
    )
  })

  it('collapses duplicate classes', () => {
    expect(cn('px-5', 'px-5')).toBe('px-5')
  })

  it('keeps a text composite alongside a color and an unknown utility', () => {
    expect(cn('text-button', 'text-primary-foreground')).toBe(
      'text-button text-primary-foreground',
    )
    expect(cn('wrapper', 'mx-4')).toBe('wrapper mx-4')
  })

  it('treats text composites as font sizes that conflict with other text sizes', () => {
    expect(cn('text-display', 'text-sm')).toBe('text-sm')
    expect(cn('text-display', 'text-heading')).toBe('text-heading')
  })

  it('returns an empty string for empty or entirely falsy input', () => {
    expect(cn()).toBe('')
    expect(cn(false, undefined, null, '')).toBe('')
  })
})
