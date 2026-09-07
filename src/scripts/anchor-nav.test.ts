// @vitest-environment happy-dom
import type { Mock } from 'vitest'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

type ScrollIntoView = (arg?: boolean | ScrollIntoViewOptions) => void

let scrollIntoView: Mock<ScrollIntoView>

const clickLink = (href: string) => {
  const link = document.createElement('a')
  link.href = href
  document.body.appendChild(link)

  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  })
  link.dispatchEvent(event)

  return { link, event }
}

beforeAll(async () => {
  await import('./anchor-nav')
})

beforeEach(() => {
  document.body.innerHTML = ''
  scrollIntoView = vi.fn<ScrollIntoView>()
  Element.prototype.scrollIntoView = scrollIntoView

  const target = document.createElement('section')
  target.id = 'about'
  document.body.appendChild(target)

  history.replaceState(null, '', '/')
})

describe('anchor navigation', () => {
  it('scrolls to the section', () => {
    clickLink('#about')

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
  })

  it('keeps the active section hash out of the url', () => {
    clickLink('#about')

    expect(location.hash).toBe('')
  })

  it('scrolls to the section when the link carries the page path', () => {
    clickLink('/#about')

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(location.hash).toBe('')
  })

  it('leaves an anchor on another page to the browser', () => {
    const { event } = clickLink('/projects/#about')

    expect(event.defaultPrevented).toBe(false)
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('leaves a link it cannot resolve to the browser', () => {
    const { event } = clickLink('#missing')

    expect(event.defaultPrevented).toBe(false)
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('lands on the section and clears the hash on every visit', () => {
    history.replaceState(null, '', '/#about')

    document.dispatchEvent(new Event('astro:page-load'))

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(location.hash).toBe('')
  })
})
