// @vitest-environment happy-dom
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const visit = () => {
  document.dispatchEvent(new Event('astro:page-load'))
}

const swap = () => {
  document.dispatchEvent(new Event('astro:after-swap'))
}

const setScrollY = (value: number) => {
  Object.defineProperty(window, 'scrollY', { value, configurable: true })
}

beforeAll(async () => {
  await import('./language-nav')
})

beforeEach(() => {
  document.body.innerHTML = `
    <a data-language-link href="/en/stale-path"></a>
    <a href="#about"></a>
  `
  history.replaceState(null, '', '/')
  setScrollY(0)
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

  it('restores the scroll position after a language swap and consumes it', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const languageLink = document.querySelector<HTMLAnchorElement>(
      '[data-language-link]',
    )
    languageLink?.addEventListener('click', (event) => event.preventDefault())

    visit()
    setScrollY(1280)
    languageLink?.click()
    swap()

    expect(scrollTo).toHaveBeenCalledWith({ top: 1280, behavior: 'instant' })

    swap()
    expect(scrollTo).toHaveBeenCalledTimes(1)

    scrollTo.mockRestore()
  })

  it('ignores swaps that do not come from the language control', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const anchor = document.querySelector<HTMLAnchorElement>('a[href="#about"]')
    anchor?.addEventListener('click', (event) => event.preventDefault())

    visit()
    setScrollY(1280)
    anchor?.click()
    swap()

    expect(scrollTo).not.toHaveBeenCalled()

    scrollTo.mockRestore()
  })
})
