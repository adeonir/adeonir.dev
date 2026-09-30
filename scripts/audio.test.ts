import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  type AudioManifest,
  manifestPath,
  narrationFile,
  narrationSections,
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
        manifest[locale][section],
        `${file} is not in the manifest; run pnpm narration`,
      ).toBe(file)
      await expect(
        access(join(process.cwd(), 'public', file)),
        `${file} is missing; run pnpm narration`,
      ).resolves.toBeUndefined()
    },
  )
})
