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
  it('scales the loudest bucket to one', () => {
    const left = Float32Array.from([0.1, -0.2, 0.05, 0.1])
    const right = Float32Array.from([0.1, 0.1, -0.4, 0.05])

    expect(summarizePeaks([left, right], 2)).toEqual([0.5, 1])
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
