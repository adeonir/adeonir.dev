import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  type AudioManifest,
  manifestPath,
  narrationFile,
  narrationSections,
  readMp3Duration,
  readSpokenTexts,
  supportedLocales,
} from './audio'

const entries = supportedLocales.flatMap((locale) =>
  narrationSections.map((section) => ({ locale, section })),
)

async function readManifest(): Promise<AudioManifest> {
  return JSON.parse(await readFile(manifestPath(), 'utf8'))
}

describe('narration sync', () => {
  it.each(entries)(
    '$locale/$section lists the audio of its current spoken text',
    async ({ locale, section }) => {
      const spoken = await readSpokenTexts(locale)
      const file = await narrationFile(locale, section, spoken[section])
      const manifest = await readManifest()

      expect(
        manifest[locale][section]?.file,
        `${file} is not in the manifest; run pnpm audio`,
      ).toBe(file)
      await expect(
        access(join(process.cwd(), 'public', file)),
        `${file} is missing; run pnpm audio`,
      ).resolves.toBeUndefined()
    },
  )

  it.each(entries)(
    '$locale/$section lists the length of its committed audio',
    async ({ locale, section }) => {
      const { file, duration } = (await readManifest())[locale][section]
      const length = await readMp3Duration(join(process.cwd(), 'public', file))

      expect(duration, `${file} has no length; run pnpm audio`).toBe(length)
    },
  )
})

describe('readMp3Duration', () => {
  it('returns the length of the fixture, a two second tone', async () => {
    const length = await readMp3Duration(
      join(process.cwd(), 'scripts/fixtures/two-seconds.mp3'),
    )

    expect(length).toBeCloseTo(2, 1)
  })
})
