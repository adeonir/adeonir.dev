// @vitest-environment happy-dom

import { beforeEach, expect, it, vi } from 'vitest'

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void

let notify: ObserverCallback
const disconnect = vi.fn()

const loadHeaderScroll = async () => {
  vi.resetModules()
  return import('./header-scroll')
}

const render = () => {
  document.body.innerHTML = '<header></header>'
  return document.querySelector('header') as HTMLElement
}

beforeEach(() => {
  vi.restoreAllMocks()
  disconnect.mockClear()

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: ObserverCallback) {
        notify = callback
      }
      observe() {}
      disconnect = disconnect
    },
  )

  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0)
    return 0
  })
})

it('reads the sentinel as the top of the page', async () => {
  const { bindHeaderScroll } = await loadHeaderScroll()
  const header = render()

  bindHeaderScroll()
  notify([{ isIntersecting: true }])

  expect(header.dataset.state).toBe('top')
})

it('marks the header once the sentinel leaves the viewport', async () => {
  const { bindHeaderScroll } = await loadHeaderScroll()
  const header = render()

  bindHeaderScroll()
  notify([{ isIntersecting: false }])

  expect(header.dataset.state).toBe('scrolled')
})

it('returns to the top reading when the sentinel comes back', async () => {
  const { bindHeaderScroll } = await loadHeaderScroll()
  const header = render()

  bindHeaderScroll()
  notify([{ isIntersecting: false }])
  notify([{ isIntersecting: true }])

  expect(header.dataset.state).toBe('top')
})

it('holds transitions closed until after the first reading', async () => {
  const frames: FrameRequestCallback[] = []
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.push(callback)
    return frames.length
  })

  const { bindHeaderScroll } = await loadHeaderScroll()
  const header = render()

  bindHeaderScroll()
  notify([{ isIntersecting: false }])

  expect(header.dataset.transition).toBeUndefined()

  for (const frame of frames) frame(0)

  expect(header.dataset.transition).toBe('open')
})

it('stops observing and takes its sentinel with it when the visit releases', async () => {
  const { bindHeaderScroll } = await loadHeaderScroll()
  render()

  const release = bindHeaderScroll()
  expect(document.body.children.length).toBe(2)

  release?.()

  expect(disconnect).toHaveBeenCalledTimes(1)
  expect(document.body.children.length).toBe(1)
})
