import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  narrationFile,
  narrationSections,
  readSpokenTexts,
  supportedLocales,
} from './audio'
import { PEAKS_BARS, summarizePeaks } from './peaks'

const entries = supportedLocales.flatMap((locale) =>
  narrationSections.map((section) => ({ locale, section })),
)

describe('summarizePeaks', () => {
  it('stretches bars from the floor at the quietest stretch to one at the loudest', () => {
    const left = Float32Array.from([0.1, -0.1, 0.25, -0.25, 0.3, -0.3])

    expect(summarizePeaks([left], 3)).toEqual([0.25, 0.81, 1])
  })

  it('gives every bar full height when the audio holds one level', () => {
    const left = Float32Array.from([0.2, -0.2, 0.2, -0.2])

    expect(summarizePeaks([left], 2)).toEqual([1, 1])
  })
})

describe('peaks sync', () => {
  it.each(entries)(
    '$locale/$section has the peaks of its current audio',
    async ({ locale, section }) => {
      const spoken = await readSpokenTexts(locale)
      const file = await narrationFile(locale, section, spoken[section])
      const peaks = JSON.parse(
        await readFile(join(process.cwd(), 'src/data/peaks.json'), 'utf8'),
      ) as Record<string, number[]>

      expect(peaks[file], `${file} has no peaks; run pnpm peaks`).toHaveLength(
        PEAKS_BARS,
      )
    },
  )
})
