import { access } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  narrationFile,
  narrationSections,
  readSpokenTexts,
  supportedLocales,
} from './audio'

const entries = supportedLocales.flatMap((locale) =>
  narrationSections.map((section) => ({ locale, section })),
)

describe('narration sync', () => {
  it.each(entries)(
    '$locale/$section has the audio of its current spoken text',
    async ({ locale, section }) => {
      const spoken = await readSpokenTexts(locale)
      const file = await narrationFile(locale, section, spoken[section])

      await expect(
        access(join(process.cwd(), 'public', file)),
        `${file} is missing; run pnpm narration`,
      ).resolves.toBeUndefined()
    },
  )
})
