// @vitest-environment happy-dom
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const visit = () => {
  document.dispatchEvent(new Event('astro:page-load'))
}

beforeAll(async () => {
  await import('./language-nav')
})

beforeEach(() => {
  document.body.innerHTML = '<a href="#about"></a>'
  sessionStorage.clear()
  history.replaceState(null, '', '/')
  document.dispatchEvent(new Event('astro:before-swap'))
})

describe('language navigation', () => {
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
