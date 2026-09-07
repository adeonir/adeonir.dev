import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Locale } from '~/helpers/content'

const getLocalizedEntry = vi.hoisted(() => vi.fn())
const getCollection = vi.hoisted(() => vi.fn())

vi.mock('~/services/localized', () => ({ getLocalizedEntry }))
vi.mock('astro:content', () => ({ getCollection }))

import { getAgentDocuments } from '~/services/agent-documents'

const entriesByLocale = {
  pt: {
    sharedSettings: {
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
    homeHero: {
      eyebrow: 'Design engineer',
      tagline: [{ text: 'Interfaces que ' }, { text: 'funcionam' }],
      description: 'Construo produtos web.',
    },
    homeProjects: {
      eyebrow: 'Projetos em destaque',
      headline: [{ text: 'Ideias ', highlight: true }, { text: 'no ar' }],
      body: 'Alguns projetos que ajudei a construir.',
      seeAll: 'Ver todos projetos',
      empty: [
        { text: 'Ainda não publiquei nenhum projeto aqui. ' },
        { text: 'me manda uma mensagem', href: '#contact' },
        { text: '.' },
      ],
    },
    homeAbout: {
      eyebrow: 'Sobre',
      headline: [{ text: 'Quem eu sou' }],
      body: 'De onde eu venho e no que trabalho hoje.',
      bio: [[{ text: 'Trabalho com frontend há anos.' }]],
    },
    homeExpertise: {
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
    homeStack: {
      eyebrow: 'Stack',
      headline: [{ text: 'Com o que eu trabalho' }],
      body: 'Ferramentas do dia a dia.',
      tools: [{ title: 'Frontend', items: ['React', 'Astro'] }],
    },
    homeContact: {
      title: [{ text: 'Vamos conversar' }],
      body: 'Me escreva.',
      social: [{ label: 'GitHub', link: 'https://github.com/adeonir' }],
    },
  },
  en: {
    sharedSettings: {
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
    homeHero: {
      eyebrow: 'Design engineer',
      tagline: [{ text: 'Interfaces that ' }, { text: 'work' }],
      description: 'I build web products.',
    },
    homeProjects: {
      eyebrow: 'Featured work',
      headline: [{ text: 'Ideas ', highlight: true }, { text: 'that shipped' }],
      body: 'A few projects I helped build.',
      seeAll: 'See all projects',
      empty: [
        { text: "I haven't published a project here yet. " },
        { text: 'send me a message', href: '#contact' },
        { text: '.' },
      ],
    },
    homeAbout: {
      eyebrow: 'About',
      headline: [{ text: 'Who I am' }],
      body: 'Where I come from and what I work on today.',
      bio: [[{ text: 'I have worked on frontend for years.' }]],
    },
    homeExpertise: {
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
    homeStack: {
      eyebrow: 'Stack',
      headline: [{ text: 'What I work with' }],
      body: 'Day-to-day tools.',
      tools: [{ title: 'Frontend', items: ['React', 'Astro'] }],
    },
    homeContact: {
      title: [{ text: "Let's talk" }],
      body: 'Write to me.',
      social: [{ label: 'GitHub', link: 'https://github.com/adeonir' }],
    },
  },
} as const

const projectEntries = {
  pt: [
    {
      id: 'pt/alpha',
      body: 'Estudo de caso.',
      data: {
        name: 'Alpha',
        summary: 'Um projeto com estudo de caso.',
        launch: '2025-06-01',
      },
    },
    {
      id: 'pt/beta',
      body: '',
      data: {
        name: 'Beta',
        summary: 'Um projeto com site próprio.',
        launch: '2024-02-10',
        url: 'https://beta.example.com',
      },
    },
    {
      id: 'pt/gama',
      body: '',
      data: {
        name: 'Gama',
        summary: 'Um projeto fora do ar.',
        launch: '2023-09-20',
      },
    },
  ],
  en: [
    {
      id: 'en/alpha',
      body: 'Case study.',
      data: {
        name: 'Alpha',
        summary: 'A project with a case study.',
        launch: '2025-06-01',
      },
    },
    {
      id: 'en/beta',
      body: '',
      data: {
        name: 'Beta',
        summary: 'A project with its own site.',
        launch: '2024-02-10',
        url: 'https://beta.example.com',
      },
    },
    {
      id: 'en/gama',
      body: '',
      data: {
        name: 'Gama',
        summary: 'An offline project.',
        launch: '2023-09-20',
      },
    },
  ],
}

type ProjectEntry = (typeof projectEntries)['pt'][number]

describe('getAgentDocuments', () => {
  beforeEach(() => {
    getCollection.mockReset()
    getCollection.mockImplementation(
      async (_collection: string, filter: (entry: ProjectEntry) => boolean) =>
        [...projectEntries.pt, ...projectEntries.en].filter(filter),
    )
    getLocalizedEntry.mockReset()
    getLocalizedEntry.mockImplementation(
      async (collection: string, locale: Locale) => {
        const entries = entriesByLocale[locale]
        const data = entries[collection as keyof typeof entries]

        if (!data) {
          throw new Error(`Missing test entry: ${locale}/${collection}`)
        }

        return { id: `${locale}/${collection}`, collection, data }
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

    for (const item of entriesByLocale.pt.homeExpertise.items) {
      expect(portuguese.markdown).toContain(`### ${item.title}`)
      expect(portuguese.markdown).toContain(item.description)
    }

    for (const item of entriesByLocale.en.homeExpertise.items) {
      expect(english.markdown).toContain(`### ${item.title}`)
      expect(english.markdown).toContain(item.description)
    }
  })

  it('carries the projects empty state in both documents for each locale', async () => {
    getCollection.mockResolvedValue([])

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

    expect(portuguese.markdown).toContain(entriesByLocale.pt.homeAbout.body)
    expect(portuguese.llms).toContain(entriesByLocale.pt.homeAbout.body)
    expect(english.markdown).toContain(entriesByLocale.en.homeAbout.body)
    expect(english.llms).toContain(entriesByLocale.en.homeAbout.body)
  })

  it('lists every project of the locale, newest first, in the markdown document', async () => {
    const { markdown } = await getAgentDocuments('en')

    const order = [
      markdown.indexOf('Alpha'),
      markdown.indexOf('Beta'),
      markdown.indexOf('Gama'),
    ]

    expect(order.every((position) => position >= 0)).toBe(true)
    expect(order[0]).toBeLessThan(order[1])
    expect(order[1]).toBeLessThan(order[2])
  })

  it('points each project at its case study, its own site, or nowhere', async () => {
    const { markdown } = await getAgentDocuments('en')

    expect(markdown).toContain(
      '- [Alpha](https://adeonir.dev/en/projects/alpha) (2025): A project with a case study.',
    )
    expect(markdown).toContain(
      '- [Beta](https://beta.example.com) (2024): A project with its own site.',
    )
    expect(markdown).toContain('- Gama (2023): An offline project.')
  })

  it('reads the projects of the requested locale only', async () => {
    const { markdown } = await getAgentDocuments('pt')

    expect(markdown).toContain(
      '- [Alpha](https://adeonir.dev/projects/alpha) (2025): Um projeto com estudo de caso.',
    )
    expect(markdown).not.toContain('A project with a case study.')
  })

  it('links the projects index from both documents for each locale', async () => {
    const portuguese = await getAgentDocuments('pt')
    const english = await getAgentDocuments('en')

    expect(portuguese.markdown).toContain(
      '[Ver todos projetos](https://adeonir.dev/projects)',
    )
    expect(portuguese.llms).toContain(
      '[Ver todos projetos](https://adeonir.dev/projects)',
    )
    expect(english.markdown).toContain(
      '[See all projects](https://adeonir.dev/en/projects)',
    )
    expect(english.llms).toContain(
      '[See all projects](https://adeonir.dev/en/projects)',
    )
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
