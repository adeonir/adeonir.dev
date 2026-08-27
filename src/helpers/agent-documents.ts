import type { Locale } from '~/helpers/content'

export const agentDocumentKinds = ['llms', 'markdown'] as const

export type AgentDocumentKind = (typeof agentDocumentKinds)[number]

export const agentDocumentSections = [
  'hero',
  'about',
  'expertise',
  'stack',
  'contact',
] as const

export type AgentDocumentSection = (typeof agentDocumentSections)[number]

export function getAgentDocumentPath(
  locale: Locale,
  kind: AgentDocumentKind,
): string {
  const localePrefix = locale === 'en' ? '/en' : ''
  const documentPath = kind === 'llms' ? '/llms.txt' : '/index.md'

  return `${localePrefix}${documentPath}`
}
