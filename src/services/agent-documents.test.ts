import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Locale } from '~/helpers/content'

const getLocalizedEntry = vi.hoisted(() => vi.fn())

vi.mock('~/services/localized', () => ({ getLocalizedEntry }))

import { getAgentDocuments } from '~/services/agent-documents'

const entriesByLocale = {
  pt: {
    settings: {
      siteName: 'Adeonir Kohl',
      agentDocument: {
        sections: {
          hero: 'Hero',
          projects: 'Projetos',
          about: 'Sobre mim',
          expertise: 'Especialidades',
          stack: 'Tecnologias',
          contact: 'Contato',
        },
      },
    },
    hero: {
      eyebrow: 'Design engineer',
      tagline: [{ text: 'Interfaces que ' }, { text: 'funcionam' }],
      description: 'Construo produtos web.',
    },
    projects: {
      eyebrow: 'Projetos em destaque',
      headline: [{ text: 'Ideias ', highlight: true }, { text: 'no ar' }],
      body: 'Alguns projetos que ajudei a construir.',
      holding: [
        { text: 'Ainda não publiquei nenhum projeto aqui. ' },
        { text: 'me manda uma mensagem', href: '#contact' },
        { text: '.' },
      ],
    },
    about: {
      eyebrow: 'Sobre',
      headline: [{ text: 'Quem eu sou' }],
      body: 'De onde eu venho e no que trabalho hoje.',
      bio: [[{ text: 'Trabalho com frontend há anos.' }]],
    },
    expertise: {
      eyebrow: 'Especialidades',
      headline: [{ text: 'O que eu ' }, { text: 'faço', highlight: true }],
      body: 'O que eu faço no dia a dia.',
      items: [
        {
          title: 'Interfaces acessíveis',
          description: 'Semântica correta e acessibilidade desde o começo.',
        },
        {
          title: 'Design systems',
          description: 'Componentes organizados para o time.',
        },
      ],
    },
    stack: {
      eyebrow: 'Stack',
      headline: [{ text: 'Com o que eu trabalho' }],
      body: 'Ferramentas do dia a dia.',
      tools: [{ title: 'Frontend', items: ['React', 'Astro'] }],
    },
    contact: {
      title: [{ text: 'Vamos conversar' }],
      body: 'Me escreva.',
      social: [{ label: 'GitHub', link: 'https://github.com/adeonir' }],
    },
  },
  en: {
    settings: {
      siteName: 'Adeonir Kohl',
      agentDocument: {
        sections: {
          hero: 'Hero',
          projects: 'Projects',
          about: 'About me',
          expertise: 'Capabilities',
          stack: 'Tech Stack',
          contact: 'Contact',
        },
      },
    },
    hero: {
      eyebrow: 'Design engineer',
      tagline: [{ text: 'Interfaces that ' }, { text: 'work' }],
      description: 'I build web products.',
    },
    projects: {
      eyebrow: 'Featured work',
      headline: [{ text: 'Ideas ', highlight: true }, { text: 'that shipped' }],
      body: 'A few projects I helped build.',
      holding: [
        { text: "I haven't published a project here yet. " },
        { text: 'send me a message', href: '#contact' },
        { text: '.' },
      ],
    },
    about: {
      eyebrow: 'About',
      headline: [{ text: 'Who I am' }],
      body: 'Where I come from and what I work on today.',
      bio: [[{ text: 'I have worked on frontend for years.' }]],
    },
    expertise: {
      eyebrow: 'Capabilities',
      headline: [{ text: 'What I ' }, { text: 'do', highlight: true }],
      body: 'What I do day to day.',
      items: [
        {
          title: 'Accessible interfaces',
          description: 'Proper semantics and accessibility from the start.',
        },
        {
          title: 'Design systems',
          description: 'Components the team can build on.',
        },
      ],
    },
    stack: {
      eyebrow: 'Stack',
      headline: [{ text: 'What I work with' }],
      body: 'Day-to-day tools.',
      tools: [{ title: 'Frontend', items: ['React', 'Astro'] }],
    },
    contact: {
      title: [{ text: "Let's talk" }],
      body: 'Write to me.',
      social: [{ label: 'GitHub', link: 'https://github.com/adeonir' }],
    },
  },
} as const

describe('getAgentDocuments', () => {
  beforeEach(() => {
    getLocalizedEntry.mockReset()
    getLocalizedEntry.mockImplementation(
      async (collection: string, entryId: string, locale: Locale) => {
        const entries = entriesByLocale[locale]
        const data = entries[collection as keyof typeof entries]

        if (!data) {
          throw new Error(`Missing test entry: ${collection}/${entryId}`)
        }

        return { id: entryId, collection, data }
      },
    )
  })

  it('carries the expertise section in both documents for each locale', async () => {
    const portuguese = await getAgentDocuments('pt')
    const english = await getAgentDocuments('en')

    expect(portuguese.markdown).toContain('## Especialidades')
    expect(portuguese.llms).toContain('## Especialidades')
    expect(english.markdown).toContain('## Capabilities')
    expect(english.llms).toContain('## Capabilities')

    for (const item of entriesByLocale.pt.expertise.items) {
      expect(portuguese.markdown).toContain(`### ${item.title}`)
      expect(portuguese.markdown).toContain(item.description)
    }

    for (const item of entriesByLocale.en.expertise.items) {
      expect(english.markdown).toContain(`### ${item.title}`)
      expect(english.markdown).toContain(item.description)
    }
  })

  it('carries the projects holding message in both documents for each locale', async () => {
    const portuguese = await getAgentDocuments('pt')
    const english = await getAgentDocuments('en')

    expect(portuguese.markdown).toContain('## Projetos')
    expect(portuguese.llms).toContain('## Projetos')
    expect(english.markdown).toContain('## Projects')
    expect(english.llms).toContain('## Projects')

    expect(portuguese.markdown).toContain(
      'Ainda não publiquei nenhum projeto aqui. [me manda uma mensagem](#contact).',
    )
    expect(portuguese.llms).toContain(
      'Ainda não publiquei nenhum projeto aqui. me manda uma mensagem.',
    )
    expect(english.markdown).toContain(
      "I haven't published a project here yet. [send me a message](#contact).",
    )
    expect(english.llms).toContain(
      "I haven't published a project here yet. send me a message.",
    )
  })

  it('places the projects section between about and expertise', async () => {
    const { llms, markdown } = await getAgentDocuments('en')

    const markdownOrder = [
      markdown.indexOf('## About me'),
      markdown.indexOf('## Projects'),
      markdown.indexOf('## Capabilities'),
    ]
    const llmsOrder = [
      llms.indexOf('## About me'),
      llms.indexOf('## Projects'),
      llms.indexOf('## Capabilities'),
    ]

    expect(markdownOrder.every((position) => position >= 0)).toBe(true)
    expect(llmsOrder.every((position) => position >= 0)).toBe(true)
    expect(markdownOrder[0]).toBeLessThan(markdownOrder[1])
    expect(markdownOrder[1]).toBeLessThan(markdownOrder[2])
    expect(llmsOrder[0]).toBeLessThan(llmsOrder[1])
    expect(llmsOrder[1]).toBeLessThan(llmsOrder[2])
  })

  it('carries the about body in both documents for each locale', async () => {
    const portuguese = await getAgentDocuments('pt')
    const english = await getAgentDocuments('en')

    expect(portuguese.markdown).toContain(entriesByLocale.pt.about.body)
    expect(portuguese.llms).toContain(entriesByLocale.pt.about.body)
    expect(english.markdown).toContain(entriesByLocale.en.about.body)
    expect(english.llms).toContain(entriesByLocale.en.about.body)
  })

  it('places the expertise section between about and stack', async () => {
    const { llms, markdown } = await getAgentDocuments('en')

    const markdownOrder = [
      markdown.indexOf('## About me'),
      markdown.indexOf('## Capabilities'),
      markdown.indexOf('## Tech Stack'),
    ]
    const llmsOrder = [
      llms.indexOf('## About me'),
      llms.indexOf('## Capabilities'),
      llms.indexOf('## Tech Stack'),
    ]

    expect(markdownOrder.every((position) => position >= 0)).toBe(true)
    expect(llmsOrder.every((position) => position >= 0)).toBe(true)
    expect(markdownOrder[0]).toBeLessThan(markdownOrder[1])
    expect(markdownOrder[1]).toBeLessThan(markdownOrder[2])
    expect(llmsOrder[0]).toBeLessThan(llmsOrder[1])
    expect(llmsOrder[1]).toBeLessThan(llmsOrder[2])
  })
})
