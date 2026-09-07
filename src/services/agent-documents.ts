import { getCollection } from 'astro:content'

import {
  type AgentDocumentSection,
  agentDocumentSections,
  getAgentDocumentPath,
} from '~/helpers/agent-documents'
import { type Locale, parseLocale } from '~/helpers/content'
import {
  getLaunchYear,
  getProjectDestination,
  sortByLaunch,
} from '~/helpers/projects'
import { getLocalizedEntry } from '~/services/localized'

type AgentDocumentProject = {
  name: string
  summary: string
  year: string
  href?: string
}

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
  projects: {
    eyebrow: string
    headline: string
    body: string
    seeAll: string
    empty: TextSegment[]
    index: string
    items: AgentDocumentProject[]
  }
  about: {
    eyebrow: string
    headline: string
    body: string
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

function serializeLinkedSegments(segments: TextSegment[]): string {
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

function getProjectsIndexURL(locale: Locale): string {
  return new URL(locale === 'en' ? '/en/projects' : '/projects', siteURL).href
}

function serializeProjects(projects: AgentDocumentProject[]): string {
  return projects
    .map((project) => {
      const name = project.href
        ? `[${project.name}](${project.href})`
        : project.name

      return `- ${name} (${project.year}): ${project.summary}`
    })
    .join('\n')
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

${content.about.body}

${content.about.bio.map(serializeLinkedSegments).join('\n\n')}

<a id="projects"></a>
## ${getSectionTitle(content, 'projects')}

${content.projects.eyebrow}

### ${content.projects.headline}

${content.projects.body}

${content.projects.items.length > 0 ? serializeProjects(content.projects.items) : serializeLinkedSegments(content.projects.empty)}

[${content.projects.seeAll}](${content.projects.index})

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
      description: content.about.body,
    },
    projects: {
      title: getSectionTitle(content, 'projects'),
      linkTitle: getSectionTitle(content, 'projects'),
      description:
        content.projects.items.length > 0
          ? `${content.projects.body} ${content.projects.items.map((project) => project.name).join(', ')}.`
          : `${content.projects.body} ${joinSegments(content.projects.empty)}`,
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

    const link = `- [${linkTitle}](${getSectionURL(locale, section)}): ${description}`

    if (section !== 'projects') {
      return `## ${title}\n\n${link}`
    }

    return `## ${title}\n\n${link}\n- [${content.projects.seeAll}](${content.projects.index}): ${content.projects.body}`
  })
  .join('\n\n')}
`
}

async function getAgentDocumentContent(
  locale: Locale,
): Promise<AgentDocumentContent> {
  const [
    settings,
    hero,
    projects,
    about,
    expertise,
    stack,
    contact,
    projectEntries,
  ] = await Promise.all([
    getLocalizedEntry('sharedSettings', locale),
    getLocalizedEntry('homeHero', locale),
    getLocalizedEntry('homeProjects', locale),
    getLocalizedEntry('homeAbout', locale),
    getLocalizedEntry('homeExpertise', locale),
    getLocalizedEntry('homeStack', locale),
    getLocalizedEntry('homeContact', locale),
    getCollection('projectsContent', (entry: { id: string }) =>
      entry.id.startsWith(`${locale}/`),
    ),
  ])

  const heroData = hero.data
  const projectsData = projects.data
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
    projects: {
      eyebrow: projectsData.eyebrow,
      headline: joinSegments(projectsData.headline),
      body: projectsData.body,
      seeAll: projectsData.seeAll,
      empty: projectsData.empty,
      index: getProjectsIndexURL(locale),
      items: sortByLaunch(projectEntries).map((entry) => {
        const slug = entry.id.slice(locale.length + 1)
        const detailURL = new URL(
          locale === 'en' ? `/en/projects/${slug}` : `/projects/${slug}`,
          siteURL,
        ).href
        const destination = getProjectDestination(entry, detailURL)

        return {
          name: entry.data.name,
          summary: entry.data.summary,
          year: getLaunchYear(entry.data.launch),
          href: destination.kind === 'offline' ? undefined : destination.href,
        }
      }),
    },
    about: {
      eyebrow: aboutData.eyebrow,
      headline: joinSegments(aboutData.headline),
      body: aboutData.body,
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
