import { describe, expect, it } from 'vitest'

import { interpolate } from '~/helpers/interpolate'

describe('interpolate', () => {
  it('replaces a single token', () => {
    expect(interpolate('Hello {name}', { name: 'Ada' })).toBe('Hello Ada')
  })

  it('replaces multiple tokens in one pass', () => {
    expect(
      interpolate('{greeting}, {name}', { greeting: 'Hi', name: 'Ada' }),
    ).toBe('Hi, Ada')
  })

  it('replaces every occurrence of a repeated token', () => {
    expect(interpolate('{name} & {name}', { name: 'Ada' })).toBe('Ada & Ada')
  })

  it('leaves a placeholder with no matching token intact', () => {
    expect(interpolate('Hello {name}', {})).toBe('Hello {name}')
  })
})
