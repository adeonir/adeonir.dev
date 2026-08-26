import {
  type AgentDocumentSection,
  getAgentDocumentPath,
} from '~/helpers/agent-documents'
import { type Locale, parseLocale } from '~/helpers/content'
import { getLocalizedEntry } from '~/services/localized'

type TextSegment = {
  text: string
  highlight?: boolean
}

type StackGroup = {
  title: string
  items: string[]
}

type AgentDocumentContent = {
  hero: {
    display: string
    eyebrow: string
    tagline: string
    description: string
  }
  about: {
    eyebrow: string
    headline: string
    bio: string[]
  }
  stack: {
    eyebrow: string
    headline: string
    body: string
    tools: StackGroup[]
  }
  contact: {
    title: string
    body: string
    social: Array<{ label: string; link: string }>
  }
}

export type AgentDocuments = {
  llms: string
  markdown: string
}

const siteURL = import.meta.env.SITE ?? 'https://adeonir.dev'

const sectionTitles: Record<Locale, Record<AgentDocumentSection, string>> = {
  pt: {
    hero: 'Hero',
    about: 'Sobre mim',
    stack: 'Tecnologias',
    contact: 'Contato',
  },
  en: {
    hero: 'Hero',
    about: 'About me',
    stack: 'Tech Stack',
    contact: 'Contact',
  },
}

function joinSegments(segments: TextSegment[]): string {
  return segments.map((segment) => segment.text).join('')
}

function getAbsoluteDocumentURL(locale: Locale, kind: 'markdown' | 'llms') {
  return new URL(getAgentDocumentPath(locale, kind), siteURL).href
}

function getSectionURL(locale: Locale, section: AgentDocumentSection): string {
  return `${getAbsoluteDocumentURL(locale, 'markdown')}#${section}`
}

function serializeStackTools(tools: StackGroup[]): string {
  return tools
    .map(
      (group) =>
        `### ${group.title}\n\n${group.items.map((item) => `- ${item}`).join('\n')}`,
    )
    .join('\n\n')
}

function serializeSocialLinks(
  social: Array<{ label: string; link: string }>,
): string {
  return social
    .map((channel) => `- [${channel.label}](${channel.link})`)
    .join('\n')
}

function serializeMarkdown(
  content: AgentDocumentContent,
  locale: Locale,
): string {
  const titles = sectionTitles[locale]

  return `# ${content.hero.display}

> ${content.hero.tagline} ${content.hero.description}

<a id="hero"></a>
## ${titles.hero}

${content.hero.eyebrow}

${content.hero.tagline}

${content.hero.description}

<a id="about"></a>
## ${titles.about}

${content.about.eyebrow}

### ${content.about.headline}

${content.about.bio.join('\n\n')}

<a id="stack"></a>
## ${titles.stack}

${content.stack.eyebrow}

### ${content.stack.headline}

${content.stack.body}

${serializeStackTools(content.stack.tools)}

<a id="contact"></a>
## ${titles.contact}

${content.contact.title}

${content.contact.body}

${serializeSocialLinks(content.contact.social)}
`
}

function serializeLlms(content: AgentDocumentContent, locale: Locale): string {
  const titles = sectionTitles[locale]
  const links = [
    [
      titles.hero,
      content.hero.display,
      `${content.hero.tagline} ${content.hero.description}`,
      'hero',
    ],
    [titles.about, titles.about, content.about.bio[0], 'about'],
    [titles.stack, titles.stack, content.stack.body, 'stack'],
    [titles.contact, titles.contact, content.contact.body, 'contact'],
  ] as const

  return `# ${content.hero.display}

> ${content.hero.tagline} ${content.hero.description}

${links
  .map(
    ([title, linkTitle, description, section]) =>
      `## ${title}\n\n- [${linkTitle}](${getSectionURL(locale, section)}): ${description}`,
  )
  .join('\n\n')}
`
}

async function getAgentDocumentContent(
  locale: Locale,
): Promise<AgentDocumentContent> {
  const [settings, hero, about, stack, contact] = await Promise.all([
    getLocalizedEntry('settings', 'metadata', locale),
    getLocalizedEntry('hero', 'hero', locale),
    getLocalizedEntry('about', 'about', locale),
    getLocalizedEntry('stack', 'stack', locale),
    getLocalizedEntry('contact', 'contact', locale),
  ])

  const heroData = hero.data
  const aboutData = about.data
  const stackData = stack.data
  const contactData = contact.data

  return {
    hero: {
      display: settings.data.siteName,
      eyebrow: heroData.eyebrow,
      tagline: joinSegments(heroData.tagline),
      description: heroData.description,
    },
    about: {
      eyebrow: aboutData.eyebrow,
      headline: joinSegments(aboutData.headline),
      bio: aboutData.bio,
    },
    stack: {
      eyebrow: stackData.eyebrow,
      headline: joinSegments(stackData.headline),
      body: stackData.body,
      tools: stackData.tools,
    },
    contact: {
      title: joinSegments(contactData.title),
      body: contactData.body,
      social: contactData.social.map(({ label, link }) => ({ label, link })),
    },
  }
}

export async function getAgentDocuments(
  locale: Locale,
): Promise<AgentDocuments> {
  const normalizedLocale = parseLocale(locale)
  const content = await getAgentDocumentContent(normalizedLocale)

  return {
    llms: serializeLlms(content, normalizedLocale),
    markdown: serializeMarkdown(content, normalizedLocale),
  }
}
