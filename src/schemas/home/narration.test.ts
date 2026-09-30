import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'

import { homeNarrationSchema } from '~/schemas/home/narration'

const labels = {
  pt: {
    hero: 'Ouça a apresentação',
    about: 'Ouça minha história',
    expertise: 'Ouça o que eu faço',
  },
  en: {
    hero: 'Listen to the intro',
    about: 'Listen to my story',
    expertise: 'Listen to what I do',
  },
}

describe('home narration schema', () => {
  it.each(['pt', 'en'] as const)(
    'labels each narrated section in both locales (%s)',
    (locale) => {
      const source = join(
        process.cwd(),
        `src/content/home/${locale}/narration.yaml`,
      )
      const entry = homeNarrationSchema.parse(
        parse(readFileSync(source, 'utf8')),
      )

      expect(entry.labels).toEqual(labels[locale])
    },
  )
})
