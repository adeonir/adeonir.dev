// @vitest-environment happy-dom
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const visit = () => {
  document.dispatchEvent(new Event('astro:page-load'))
}

beforeAll(async () => {
  await import('./language-nav')
})

beforeEach(() => {
  document.body.innerHTML = `
    <a data-language-link href="/en/stale-path"></a>
    <a href="#about"></a>
  `
  sessionStorage.clear()
  history.replaceState(null, '', '/')
  document.dispatchEvent(new Event('astro:before-swap'))
})

describe('language navigation', () => {
  it('updates persisted language links after the pathname changes', () => {
    const languageLink = document.querySelector<HTMLAnchorElement>(
      '[data-language-link]',
    )

    visit()
    expect(languageLink?.getAttribute('href')).toBe('/en/')

    history.replaceState(null, '', '/en/nested/missing-page')
    document.dispatchEvent(new Event('astro:before-swap'))
    visit()

    expect(languageLink?.getAttribute('href')).toBe('/nested/missing-page')
  })

  it('restores the stored section after a language visit and consumes it', () => {
    const target = document.createElement('section')
    target.id = 'about'
    const scrollIntoView = vi.fn()
    target.scrollIntoView = scrollIntoView
    document.body.appendChild(target)

    visit()
    document.querySelector<HTMLAnchorElement>('a[href="#about"]')?.click()

    expect(sessionStorage.getItem('language-control:current-section')).toBe(
      'about',
    )

    document.body.innerHTML = '<section id="about"></section>'
    const restoredTarget = document.getElementById('about') as HTMLElement
    restoredTarget.scrollIntoView = scrollIntoView
    history.replaceState(null, '', '/en/')
    document.dispatchEvent(new Event('astro:before-swap'))
    visit()

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(
      sessionStorage.getItem('language-control:current-section'),
    ).toBeNull()
    expect(location.hash).toBe('')
  })
})
