// @vitest-environment happy-dom

import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const loadParallax = async () => {
  vi.resetModules()
  return import('./hero-parallax')
}

let frames: FrameRequestCallback[] = []

const hero = () => document.querySelector<HTMLElement>('#hero') as HTMLElement
const px = () => Number(hero().style.getPropertyValue('--px'))
const flush = () => {
  const run = frames
  frames = []
  for (const callback of run) callback(0)
}

const move = (clientX: number, clientY: number) => {
  hero().dispatchEvent(new MouseEvent('pointermove', { clientX, clientY }))
}

beforeEach(() => {
  frames = []
  document.body.innerHTML = '<section id="hero"></section>'
  hero().getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 200, height: 100 }) as DOMRect
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.push(callback)
    return frames.length
  })
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const coarse = (matches: boolean) => {
  vi.stubGlobal('matchMedia', () => ({ matches }))
}

it('moves the offsets toward the pointer by 5% of the remaining distance each frame', async () => {
  coarse(false)
  const { bindParallax } = await loadParallax()
  bindParallax()

  move(200, 50)
  flush()
  expect(px()).toBeCloseTo(0.05)
  flush()
  expect(px()).toBeCloseTo(0.05 + 0.95 * 0.05)
  expect(Number(hero().style.getPropertyValue('--py'))).toBe(0)
})

it('requests no frame once the offset reaches the pointer', async () => {
  coarse(false)
  const { bindParallax } = await loadParallax()
  bindParallax()

  move(200, 50)
  for (let i = 0; i < 400 && frames.length > 0; i++) flush()

  expect(frames).toHaveLength(0)
  expect(px()).toBe(1)
})

it('registers no pointer listener when the pointer is coarse', async () => {
  coarse(true)
  const add = vi.spyOn(hero(), 'addEventListener')
  const { bindParallax } = await loadParallax()

  expect(bindParallax()).toBeUndefined()
  expect(add).not.toHaveBeenCalled()
})

it('registers no pointer listener when reduced motion is requested', async () => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
  }))
  const add = vi.spyOn(hero(), 'addEventListener')
  const { bindParallax } = await loadParallax()

  expect(bindParallax()).toBeUndefined()
  expect(add).not.toHaveBeenCalled()
})

it('stops following the pointer once the visit ends', async () => {
  coarse(false)
  const { bindParallax } = await loadParallax()
  const cleanup = bindParallax() as () => void

  cleanup()
  move(200, 50)

  expect(frames).toHaveLength(0)
  expect(px()).toBe(0)
})
