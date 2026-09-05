import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '~/test-utils/render-astro'

import Hero from './hero.astro'

describe('hero section', () => {
  it('renders the hero through the shared helper', async () => {
    const html = await renderAstroComponent(Hero, 'pt')

    expect(html).toContain('Adeonir Kohl')
  })

  it.each([
    ['pt', 'role para ver mais'],
    ['en', 'scroll for more'],
  ])('renders the hero copy for locale %s', async (locale, scroll) => {
    const html = await renderAstroComponent(Hero, locale as 'pt' | 'en')

    expect(html).toContain(scroll)
  })

  it('renders the hero from configured collection entries', async () => {
    const html = await renderAstroComponent(Hero, 'pt')

    expect(html).toContain('Frontend Engineer')
    expect(html).toContain('Ver meu trabalho')
  })
})
