import { format } from 'date-fns'
import { enUS, ptBR } from 'date-fns/locale'

import type { Locale } from '~/helpers/content'

export type ProjectDestinationKind = 'internal' | 'external' | 'offline'

export interface ProjectLike {
  id: string
  data: {
    launch: string
    destination: ProjectDestinationKind
    url?: string
    featured?: boolean
  }
}

export type ProjectDestination =
  | { kind: 'internal'; href: string }
  | { kind: 'external'; href: string; domain: string }
  | { kind: 'offline' }

const MIN_FEATURED = 1
const MAX_FEATURED = 3

export function sortByLaunch<TProject extends ProjectLike>(
  entries: TProject[],
): TProject[] {
  return [...entries].sort((a, b) => b.data.launch.localeCompare(a.data.launch))
}

export function getLaunchYear(launch: string): string {
  return launch.slice(0, 4)
}

export function formatLaunch(launch: string, locale: Locale): string {
  const [year, month] = launch.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  const abbreviated = format(date, 'LLL', {
    locale: locale === 'pt' ? ptBR : enUS,
  })

  return `${abbreviated.charAt(0).toUpperCase()}${abbreviated.slice(1)}/${year}`
}

export function getProjectDestination(
  entry: ProjectLike,
  href: string,
): ProjectDestination {
  if (entry.data.destination === 'internal') {
    return { kind: 'internal', href }
  }

  if (entry.data.destination === 'external' && entry.data.url) {
    return {
      kind: 'external',
      href: entry.data.url,
      domain: new URL(entry.data.url).hostname.replace(/^www\./, ''),
    }
  }

  return { kind: 'offline' }
}

export function assertFeaturedBounds(entries: ProjectLike[]): void {
  const count = entries.filter((entry) => entry.data.featured).length

  if (count < MIN_FEATURED || count > MAX_FEATURED) {
    throw new Error(
      `Featured projects must be between ${MIN_FEATURED} and ${MAX_FEATURED}, found ${count}`,
    )
  }
}
