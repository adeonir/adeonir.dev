export interface ProjectLike {
  id: string
  body?: string
  data: {
    launch: string
    url?: string
    featured?: boolean
  }
}

export type ProjectDestination =
  | { kind: 'case-study'; href: string }
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

export function getProjectDestination(
  entry: ProjectLike,
  href: string,
): ProjectDestination {
  if (entry.body?.trim()) {
    return { kind: 'case-study', href }
  }

  if (entry.data.url) {
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
