// @vitest-environment happy-dom

import { beforeEach, expect, it, vi } from 'vitest'

const loadHeaderScroll = async () => {
  vi.resetModules()
  return import('./header-scroll')
}

const render = () => {
  document.body.innerHTML = '<header><a href="#about">sobre</a></header>'
  return document.querySelector('header') as HTMLElement
}

const scrollTo = (value: number) => {
  Object.defineProperty(window, 'scrollY', { value, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

beforeEach(() => {
  vi.restoreAllMocks()
  scrollTo(0)
})

it('hides the header on a downward scroll away from the top', async () => {
  const { bindHeaderScroll } = await loadHeaderScroll()
  const header = render()

  bindHeaderScroll()
  expect(header.dataset.state).toBe('visible')

  scrollTo(120)

  expect(header.dataset.state).toBe('hidden')
})

it('shows the header on an upward scroll', async () => {
  const { bindHeaderScroll } = await loadHeaderScroll()
  const header = render()

  bindHeaderScroll()
  scrollTo(400)
  expect(header.dataset.state).toBe('hidden')

  scrollTo(380)

  expect(header.dataset.state).toBe('visible')
})

it('shows the header at scroll position zero', async () => {
  const { bindHeaderScroll } = await loadHeaderScroll()
  const header = render()

  bindHeaderScroll()
  scrollTo(400)
  expect(header.dataset.state).toBe('hidden')

  scrollTo(0)

  expect(header.dataset.state).toBe('visible')
})

it('shows the header when focus enters it', async () => {
  const { bindHeaderScroll } = await loadHeaderScroll()
  const header = render()

  bindHeaderScroll()
  scrollTo(400)
  expect(header.dataset.state).toBe('hidden')

  const link = header.querySelector('a') as HTMLElement
  link.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))

  expect(header.dataset.state).toBe('visible')
})

it('stops listening to scroll and focus when the visit releases', async () => {
  const { bindHeaderScroll } = await loadHeaderScroll()
  const header = render()

  const release = bindHeaderScroll()
  release?.()

  scrollTo(400)
  expect(header.dataset.state).toBe('visible')

  header.dataset.state = 'hidden'
  const link = header.querySelector('a') as HTMLElement
  link.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))

  expect(header.dataset.state).toBe('hidden')
})
