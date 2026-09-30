import type { Locale } from '~/helpers/locale'

export const agentDocumentKinds = ['llms', 'markdown'] as const

export type AgentDocumentKind = (typeof agentDocumentKinds)[number]

export const agentDocumentSections = [
  'hero',
  'about',
  'projects',
  'expertise',
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
