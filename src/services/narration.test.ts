import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'

import { supportedLocales } from '~/helpers/content'
import { narrationFile, narrationSections } from '~/helpers/narration'
import { homeNarrationSchema } from '~/schemas/home/narration'

const entries = supportedLocales.flatMap((locale) =>
  narrationSections.map((section) => ({ locale, section })),
)

describe('narration sync', () => {
  it.each(entries)(
    '$locale/$section has the audio of its current spoken text',
    async ({ locale, section }) => {
      const source = join(
        process.cwd(),
        `src/content/home/${locale}/narration.yaml`,
      )
      const entry = homeNarrationSchema.parse(
        parse(await readFile(source, 'utf8')),
      )
      const file = await narrationFile(locale, section, entry.spoken[section])

      await expect(
        access(join(process.cwd(), 'public', file)),
        `${file} is missing; run pnpm narration`,
      ).resolves.toBeUndefined()
    },
  )
})
