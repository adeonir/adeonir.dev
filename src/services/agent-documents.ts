import {
  type AgentDocumentSection,
  agentDocumentSections,
  getAgentDocumentPath,
} from '~/helpers/agent-documents'
import { type Locale, parseLocale } from '~/helpers/content'
import { getLocalizedEntry } from '~/services/localized'

type TextSegment = {
  text: string
  highlight?: boolean
  href?: string
}

type StackGroup = {
  title: string
  items: string[]
}

type ExpertiseItem = {
  title: string
  description: string
}

type AgentDocumentContent = {
  agentDocument: {
    sections: Record<AgentDocumentSection, string>
  }
  hero: {
    display: string
    eyebrow: string
    tagline: string
    description: string
  }
  about: {
    eyebrow: string
    headline: string
    bio: TextSegment[][]
  }
  expertise: {
    eyebrow: string
    headline: string
    body: string
    items: ExpertiseItem[]
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

function getSectionTitle(
  content: AgentDocumentContent,
  section: AgentDocumentSection,
): string {
  return content.agentDocument.sections[section]
}

function joinSegments(segments: TextSegment[]): string {
  return segments.map((segment) => segment.text).join('')
}

function serializeBioParagraph(segments: TextSegment[]): string {
  return segments
    .map((segment) =>
      segment.href ? `[${segment.text}](${segment.href})` : segment.text,
    )
    .join('')
}

function getAbsoluteDocumentURL(locale: Locale, kind: 'markdown' | 'llms') {
  return new URL(getAgentDocumentPath(locale, kind), siteURL).href
}

function getSectionURL(locale: Locale, section: AgentDocumentSection): string {
  return `${getAbsoluteDocumentURL(locale, 'markdown')}#${section}`
}

function serializeExpertiseItems(items: ExpertiseItem[]): string {
  return items
    .map((item) => `### ${item.title}\n\n${item.description}`)
    .join('\n\n')
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

function serializeMarkdown(content: AgentDocumentContent): string {
  return `# ${content.hero.display}

> ${content.hero.tagline} ${content.hero.description}

<a id="hero"></a>
## ${getSectionTitle(content, 'hero')}

${content.hero.eyebrow}

${content.hero.tagline}

${content.hero.description}

<a id="about"></a>
## ${getSectionTitle(content, 'about')}

${content.about.eyebrow}

### ${content.about.headline}

${content.about.bio.map(serializeBioParagraph).join('\n\n')}

<a id="expertise"></a>
## ${getSectionTitle(content, 'expertise')}

${content.expertise.eyebrow}

### ${content.expertise.headline}

${content.expertise.body}

${serializeExpertiseItems(content.expertise.items)}

<a id="stack"></a>
## ${getSectionTitle(content, 'stack')}

${content.stack.eyebrow}

### ${content.stack.headline}

${content.stack.body}

${serializeStackTools(content.stack.tools)}

<a id="contact"></a>
## ${getSectionTitle(content, 'contact')}

${content.contact.title}

${content.contact.body}

${serializeSocialLinks(content.contact.social)}
`
}

function serializeLlms(content: AgentDocumentContent, locale: Locale): string {
  const linksBySection: Record<
    AgentDocumentSection,
    { title: string; linkTitle: string; description: string }
  > = {
    hero: {
      title: getSectionTitle(content, 'hero'),
      linkTitle: content.hero.display,
      description: `${content.hero.tagline} ${content.hero.description}`,
    },
    about: {
      title: getSectionTitle(content, 'about'),
      linkTitle: getSectionTitle(content, 'about'),
      description: joinSegments(content.about.bio[0]),
    },
    expertise: {
      title: getSectionTitle(content, 'expertise'),
      linkTitle: getSectionTitle(content, 'expertise'),
      description: content.expertise.body,
    },
    stack: {
      title: getSectionTitle(content, 'stack'),
      linkTitle: getSectionTitle(content, 'stack'),
      description: content.stack.body,
    },
    contact: {
      title: getSectionTitle(content, 'contact'),
      linkTitle: getSectionTitle(content, 'contact'),
      description: content.contact.body,
    },
  }

  return `# ${content.hero.display}

> ${content.hero.tagline} ${content.hero.description}

${agentDocumentSections
  .map((section) => {
    const { title, linkTitle, description } = linksBySection[section]

    return `## ${title}\n\n- [${linkTitle}](${getSectionURL(locale, section)}): ${description}`
  })
  .join('\n\n')}
`
}

async function getAgentDocumentContent(
  locale: Locale,
): Promise<AgentDocumentContent> {
  const [settings, hero, about, expertise, stack, contact] = await Promise.all([
    getLocalizedEntry('settings', 'metadata', locale),
    getLocalizedEntry('hero', 'hero', locale),
    getLocalizedEntry('about', 'about', locale),
    getLocalizedEntry('expertise', 'expertise', locale),
    getLocalizedEntry('stack', 'stack', locale),
    getLocalizedEntry('contact', 'contact', locale),
  ])

  const heroData = hero.data
  const aboutData = about.data
  const expertiseData = expertise.data
  const stackData = stack.data
  const contactData = contact.data

  return {
    agentDocument: settings.data.agentDocument,
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
    expertise: {
      eyebrow: expertiseData.eyebrow,
      headline: joinSegments(expertiseData.headline),
      body: expertiseData.body,
      items: expertiseData.items,
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
    markdown: serializeMarkdown(content),
  }
}
