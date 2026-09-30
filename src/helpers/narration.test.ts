import { describe, expect, it } from 'vitest'

import {
  NARRATION_BARS,
  narrationSections,
  placeholderPeaks,
} from '~/helpers/narration'

describe('narration sections', () => {
  it('lists the narrated sections in page order', () => {
    expect(narrationSections).toEqual(['hero', 'about', 'expertise'])
  })
})

describe('placeholderPeaks', () => {
  it('returns the same full set of peaks for the same seed', () => {
    const first = placeholderPeaks(
      '/narration/pt/hero.test.mp3',
      NARRATION_BARS,
    )
    const second = placeholderPeaks(
      '/narration/pt/hero.test.mp3',
      NARRATION_BARS,
    )

    expect(first).toHaveLength(NARRATION_BARS)
    expect(second).toEqual(first)
    expect(first.every((peak) => peak >= 0 && peak <= 1)).toBe(true)
    expect(
      placeholderPeaks('/narration/en/about.test.mp3', NARRATION_BARS),
    ).not.toEqual(first)
  })
})
