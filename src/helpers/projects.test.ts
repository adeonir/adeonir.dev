import { describe, expect, it } from 'vitest'

import {
  assertFeaturedBounds,
  formatLaunch,
  getLaunchYear,
  getProjectDestination,
  type ProjectLike,
  sortByLaunch,
} from '~/helpers/projects'

function project(
  id: string,
  data: Partial<ProjectLike['data']> = {},
): ProjectLike {
  return { id, data: { launch: '2025-01-01', destination: 'offline', ...data } }
}

describe('sortByLaunch', () => {
  it('orders entries by launch date, newest first', () => {
    const entries = [
      project('a', { launch: '2024-06-10' }),
      project('b', { launch: '2025-03-02' }),
      project('c', { launch: '2024-11-30' }),
    ]

    expect(sortByLaunch(entries).map((entry) => entry.id)).toEqual([
      'b',
      'c',
      'a',
    ])
  })

  it('leaves the given array untouched', () => {
    const entries = [
      project('a', { launch: '2024-06-10' }),
      project('b', { launch: '2025-03-02' }),
    ]

    sortByLaunch(entries)

    expect(entries.map((entry) => entry.id)).toEqual(['a', 'b'])
  })
})

describe('getLaunchYear', () => {
  it('reads the year from the launch date', () => {
    expect(getLaunchYear('2024-06-10')).toBe('2024')
  })
})

describe('formatLaunch', () => {
  it('formats the launch as an abbreviated month and year in each locale', () => {
    expect(formatLaunch('2025-09-01', 'pt')).toBe('Set/2025')
    expect(formatLaunch('2025-09-01', 'en')).toBe('Sep/2025')
  })

  it('reads the month from the string, never from a parsed instant', () => {
    expect(formatLaunch('2026-01-01', 'pt')).toBe('Jan/2026')
    expect(formatLaunch('2026-01-01', 'en')).toBe('Jan/2026')
  })
})

describe('getProjectDestination', () => {
  it('points at the page when the entry is marked internal', () => {
    const entry = project('pt/one', {
      destination: 'internal',
      url: 'https://one.dev',
    })

    expect(getProjectDestination(entry, '/projects/one')).toEqual({
      kind: 'internal',
      href: '/projects/one',
    })
  })

  it('points at the site when the entry is marked external', () => {
    const entry = project('pt/one', {
      destination: 'external',
      url: 'https://one.dev/work',
    })

    expect(getProjectDestination(entry, '/projects/one')).toEqual({
      kind: 'external',
      href: 'https://one.dev/work',
      domain: 'one.dev',
    })
  })

  it('strips a leading www from the domain', () => {
    const entry = project('pt/one', {
      destination: 'external',
      url: 'https://www.one.dev',
    })

    expect(getProjectDestination(entry, '/projects/one')).toEqual({
      kind: 'external',
      href: 'https://www.one.dev',
      domain: 'one.dev',
    })
  })

  it('marks the project offline when it is marked offline', () => {
    expect(getProjectDestination(project('pt/one'), '/projects/one')).toEqual({
      kind: 'offline',
    })
  })
})

describe('assertFeaturedBounds', () => {
  it('throws when no entry is featured', () => {
    expect(() => assertFeaturedBounds([project('a'), project('b')])).toThrow(
      /Featured projects must be between 1 and 3, found 0/,
    )
  })

  it('accepts one featured entry', () => {
    expect(() =>
      assertFeaturedBounds([project('a', { featured: true }), project('b')]),
    ).not.toThrow()
  })

  it('accepts three featured entries', () => {
    expect(() =>
      assertFeaturedBounds([
        project('a', { featured: true }),
        project('b', { featured: true }),
        project('c', { featured: true }),
      ]),
    ).not.toThrow()
  })

  it('throws on four featured entries', () => {
    expect(() =>
      assertFeaturedBounds([
        project('a', { featured: true }),
        project('b', { featured: true }),
        project('c', { featured: true }),
        project('d', { featured: true }),
      ]),
    ).toThrow(/Featured projects must be between 1 and 3, found 4/)
  })
})
