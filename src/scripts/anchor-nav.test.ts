// @vitest-environment happy-dom
import type { Mock } from 'vitest'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

type ScrollIntoView = (arg?: boolean | ScrollIntoViewOptions) => void

const SCROLL_LOCK_ATTRIBUTE = 'data-scroll-lock'

let scrollIntoView: Mock<ScrollIntoView>

const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  await new Promise((resolve) => setTimeout(resolve, 0))
}

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

beforeEach(async () => {
  document.body.removeAttribute(SCROLL_LOCK_ATTRIBUTE)
  await settle()

  document.body.innerHTML = ''
  scrollIntoView = vi.fn<ScrollIntoView>()
  Element.prototype.scrollIntoView = scrollIntoView

  const target = document.createElement('section')
  target.id = 'about'
  document.body.appendChild(target)
})

describe('anchor navigation', () => {
  it('reaches component handlers before the event is cancelled', () => {
    let seenByComponent: boolean | null = null

    const link = document.createElement('a')
    link.href = '#about'
    link.addEventListener('click', (event) => {
      seenByComponent = event.defaultPrevented
    })
    document.body.appendChild(link)

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
    })
    link.dispatchEvent(event)

    expect(seenByComponent).toBe(false)
    expect(event.defaultPrevented).toBe(true)
  })

  it('scrolls to the target when nothing holds the page', () => {
    clickLink('#about')

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
  })

  it('leaves an unknown target alone', () => {
    clickLink('#missing')

    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('holds the scroll while an overlay locks the page', async () => {
    document.body.setAttribute(SCROLL_LOCK_ATTRIBUTE, '')

    clickLink('#about')
    await settle()

    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('scrolls once the overlay releases the page', async () => {
    document.body.setAttribute(SCROLL_LOCK_ATTRIBUTE, '')

    clickLink('#about')
    await settle()
    expect(scrollIntoView).not.toHaveBeenCalled()

    document.body.removeAttribute(SCROLL_LOCK_ATTRIBUTE)
    await settle()

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
  })
})
