import { describe, expect, it } from 'vitest'

import { getLocalizedPath } from './locale-path'

describe('getLocalizedPath', () => {
  it.each([
    ['/', 'en', '/en/'],
    ['/nested/missing-page', 'en', '/en/nested/missing-page'],
    ['/nested/missing-page/', 'en', '/en/nested/missing-page/'],
    ['/en/', 'pt', '/'],
    ['/en/nested/missing-page', 'pt', '/nested/missing-page'],
    ['/en/nested/missing-page/', 'pt', '/nested/missing-page/'],
  ] as const)('maps %s to %s at %s', (pathname, targetLocale, expected) => {
    expect(getLocalizedPath(pathname, targetLocale)).toBe(expected)
  })
})
