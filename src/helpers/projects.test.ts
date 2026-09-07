import { describe, expect, it } from 'vitest'

import {
  assertFeaturedBounds,
  getLaunchYear,
  getProjectDestination,
  type ProjectLike,
  sortByLaunch,
} from '~/helpers/projects'

function project(
  id: string,
  data: Partial<ProjectLike['data']> = {},
  body?: string,
): ProjectLike {
  return { id, body, data: { launch: '2025-01-01', ...data } }
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

describe('getProjectDestination', () => {
  it('points at the case study when the entry has a body', () => {
    const entry = project('pt/one', { url: 'https://one.dev' }, '# One')

    expect(getProjectDestination(entry, '/projects/one')).toEqual({
      kind: 'case-study',
      href: '/projects/one',
    })
  })

  it('treats a blank body as no case study', () => {
    const entry = project('pt/one', { url: 'https://one.dev' }, '\n  \n')

    expect(getProjectDestination(entry, '/projects/one')).toEqual({
      kind: 'external',
      href: 'https://one.dev',
      domain: 'one.dev',
    })
  })

  it('points at the site when the entry has only a url', () => {
    const entry = project('pt/one', { url: 'https://one.dev/work' })

    expect(getProjectDestination(entry, '/projects/one')).toEqual({
      kind: 'external',
      href: 'https://one.dev/work',
      domain: 'one.dev',
    })
  })

  it('strips a leading www from the domain', () => {
    const entry = project('pt/one', { url: 'https://www.one.dev' })

    expect(getProjectDestination(entry, '/projects/one')).toEqual({
      kind: 'external',
      href: 'https://www.one.dev',
      domain: 'one.dev',
    })
  })

  it('marks the project offline without a body and without a url', () => {
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
      assertFeaturedBounds([project('a', { featured: 1 }), project('b')]),
    ).not.toThrow()
  })

  it('accepts three featured entries', () => {
    expect(() =>
      assertFeaturedBounds([
        project('a', { featured: 1 }),
        project('b', { featured: 2 }),
        project('c', { featured: 3 }),
      ]),
    ).not.toThrow()
  })

  it('throws on four featured entries', () => {
    expect(() =>
      assertFeaturedBounds([
        project('a', { featured: 1 }),
        project('b', { featured: 2 }),
        project('c', { featured: 3 }),
        project('d', { featured: 4 }),
      ]),
    ).toThrow(/Featured projects must be between 1 and 3, found 4/)
  })
})
