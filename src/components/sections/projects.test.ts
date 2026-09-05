import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Locale } from '~/helpers/content'
import { getCollection, getEntry } from '~/test-utils/mock-astro-content'

const getLocalizedEntry = vi.hoisted(() => vi.fn())

vi.mock('astro:content', () => ({ getCollection, getEntry }))
vi.mock('~/services/localized', () => ({ getLocalizedEntry }))

import { renderAstroComponent } from '~/test-utils/render-astro'
import Projects from './projects.astro'

const copyByLocale = {
  pt: {
    eyebrow: 'Projetos',
    headline: [
      { text: 'Trabalhos ' },
      { text: 'selecionados', highlight: true },
    ],
    body: 'Um corpo qualquer.',
    empty: [
      { text: 'Nada por aqui ainda. ' },
      { text: 'Fale comigo', href: '#contact' },
    ],
  },
  en: {
    eyebrow: 'Projects',
    headline: [{ text: 'Selected ' }, { text: 'work', highlight: true }],
    body: 'Some body.',
    empty: [
      { text: 'Nothing here yet. ' },
      { text: 'Talk to me', href: '#contact' },
    ],
  },
} satisfies Record<Locale, unknown>

const cover = (name: string) => ({
  src: `/covers/${name}.png`,
  width: 1280,
  height: 549,
  format: 'png' as const,
})

const project = (
  locale: Locale,
  slug: string,
  name: string,
  featured?: number,
) => ({
  id: `${locale}/${slug}`,
  data: {
    name,
    category: locale === 'pt' ? 'Aplicativo' : 'Application',
    summary: locale === 'pt' ? `Resumo de ${name}.` : `Summary of ${name}.`,
    launch: 'Março 2024',
    cover: cover(slug),
    featured,
  },
})

type Entry = ReturnType<typeof project>

function mockEntries(entries: Entry[]) {
  getCollection.mockImplementation(
    async (_collection: string, filter?: (entry: Entry) => boolean) =>
      filter ? entries.filter(filter) : entries,
  )
}

describe('projects section', () => {
  beforeEach(() => {
    getLocalizedEntry.mockReset()
    getLocalizedEntry.mockImplementation(
      async (_collection: string, locale: Locale) => ({
        data: copyByLocale[locale],
      }),
    )
    getCollection.mockReset()
    mockEntries([])
  })

  it('shows one card per featured project instead of the empty state', async () => {
    mockEntries([
      project('pt', 'alpha', 'Alpha', 1),
      project('pt', 'beta', 'Beta', 2),
      project('pt', 'gamma', 'Gamma'),
    ])

    const html = await renderAstroComponent(Projects, 'pt')

    expect(html).toContain('href="/projects/alpha/"')
    expect(html).toContain('href="/projects/beta/"')
    expect(html).not.toContain('Gamma')
    expect(html).not.toContain('Nada por aqui ainda.')
  })

  it('keeps the cards in the featured order', async () => {
    mockEntries([
      project('pt', 'third', 'Third', 3),
      project('pt', 'first', 'First', 1),
      project('pt', 'second', 'Second', 2),
    ])

    const html = await renderAstroComponent(Projects, 'pt')

    const positions = ['First', 'Second', 'Third'].map((name) =>
      html.indexOf(`>${name}<`),
    )

    expect(positions.every((position) => position >= 0)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })

  it('shows the empty state when nothing is featured', async () => {
    mockEntries([project('pt', 'alpha', 'Alpha')])

    const html = await renderAstroComponent(Projects, 'pt')

    expect(html).toContain('Nada por aqui ainda.')
    expect(html).toContain('href="#contact"')
    expect(html).not.toContain('Alpha')
  })

  it('names each project in the page language', async () => {
    mockEntries([
      project('pt', 'alpha', 'Alfa', 1),
      project('en', 'alpha', 'Alpha', 1),
    ])

    const pt = await renderAstroComponent(Projects, 'pt')
    const en = await renderAstroComponent(Projects, 'en')

    expect(pt).toContain('Alfa')
    expect(pt).toContain('Resumo de Alfa.')
    expect(pt).not.toContain('Summary of Alpha.')
    expect(pt).toContain('href="/projects/alpha/"')

    expect(en).toContain('Alpha')
    expect(en).toContain('Summary of Alpha.')
    expect(en).not.toContain('Resumo de Alfa.')
    expect(en).toContain('href="/en/projects/alpha/"')
  })

  it('carries the cover of each project', async () => {
    mockEntries([
      project('pt', 'alpha', 'Alpha', 1),
      project('pt', 'beta', 'Beta', 2),
    ])

    const html = await renderAstroComponent(Projects, 'pt')

    expect(html).toContain(encodeURIComponent('/covers/alpha.png'))
    expect(html).toContain(encodeURIComponent('/covers/beta.png'))
  })
})
