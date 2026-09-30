import { describe, expect, it } from 'vitest'

import { narrationSections } from '~/helpers/narration'

describe('narration sections', () => {
  it('lists the narrated sections in page order', () => {
    expect(narrationSections).toEqual(['hero', 'about', 'expertise'])
  })
})
