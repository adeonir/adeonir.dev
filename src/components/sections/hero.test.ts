import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Locale } from '~/helpers/content'

const getLocalizedEntry = vi.hoisted(() => vi.fn())

vi.mock('~/services/localized', () => ({ getLocalizedEntry }))

import { renderAstroComponent } from '~/test-utils/render-astro'
import Hero from './hero.astro'

const heroDataByLocale = {
  pt: {
    eyebrow: 'Olá mundo',
    display: 'Fulano de Tal',
    tagline: [{ text: 'Eu crio ' }, { text: 'coisas', highlight: true }],
    description: 'Uma descrição qualquer.',
    actions: {
      primary: { label: 'Botão principal', href: '#a' },
      secondary: { label: 'Botão secundário', href: '#b' },
    },
    scroll: 'desça para ver mais',
  },
  en: {
    eyebrow: 'Hello world',
    display: 'John Doe',
    tagline: [{ text: 'I make ' }, { text: 'things', highlight: true }],
    description: 'Some description.',
    actions: {
      primary: { label: 'Primary button', href: '#a' },
      secondary: { label: 'Secondary button', href: '#b' },
    },
    scroll: 'scroll down for more',
  },
} satisfies Record<Locale, unknown>

describe('hero section', () => {
  beforeEach(() => {
    getLocalizedEntry.mockReset()
    getLocalizedEntry.mockImplementation(
      async (_collection, locale: Locale) => ({
        data: heroDataByLocale[locale],
      }),
    )
  })

  it('renders the hero through the shared helper', async () => {
    const html = await renderAstroComponent(Hero, 'pt')

    expect(html).toContain(heroDataByLocale.pt.display)
  })

  it.each(['pt', 'en'] as const)(
    'renders the hero copy for locale %s',
    async (locale) => {
      const html = await renderAstroComponent(Hero, locale)

      expect(html).toContain(heroDataByLocale[locale].eyebrow)
      expect(html).toContain(heroDataByLocale[locale].scroll)
    },
  )
})
