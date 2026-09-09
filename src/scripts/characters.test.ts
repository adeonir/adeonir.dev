// @vitest-environment happy-dom

import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const loadCharacters = async () => {
  vi.resetModules()
  return import('./characters')
}

const render = () => {
  document.body.innerHTML =
    '<img data-character="coffee" alt="" loading="lazy" /><img data-character="beer" alt="" loading="lazy" hidden />'
  return {
    coffee: document.querySelector(
      '[data-character="coffee"]',
    ) as HTMLImageElement,
    beer: document.querySelector('[data-character="beer"]') as HTMLImageElement,
  }
}

const setClock = (hours: number, minutes = 0) => {
  vi.setSystemTime(new Date(2026, 8, 9, hours, minutes))
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it('shows coffee within business hours', async () => {
  setClock(10)
  const { bindCharacters } = await loadCharacters()
  const { coffee, beer } = render()
  beer.hidden = false
  coffee.hidden = true

  bindCharacters()

  expect(coffee.hidden).toBe(false)
  expect(beer.hidden).toBe(true)
})

it('shows beer outside business hours', async () => {
  setClock(20)
  const { bindCharacters } = await loadCharacters()
  const { coffee, beer } = render()

  bindCharacters()

  expect(coffee.hidden).toBe(true)
  expect(beer.hidden).toBe(false)
})

it('switches the character when the clock crosses a boundary', async () => {
  setClock(17, 59)
  const { bindCharacters } = await loadCharacters()
  const { coffee, beer } = render()

  bindCharacters()
  expect(coffee.hidden).toBe(false)

  vi.advanceTimersByTime(2 * 60 * 1000)

  expect(coffee.hidden).toBe(true)
  expect(beer.hidden).toBe(false)
})

it('warms the hidden character after binding', async () => {
  setClock(10)
  const { bindCharacters } = await loadCharacters()
  const { coffee, beer } = render()

  bindCharacters()

  expect(beer.loading).toBe('eager')
  expect(coffee.loading).toBe('lazy')
})

it('binds on each visit through the page load event', async () => {
  setClock(20)
  await loadCharacters()
  const { coffee, beer } = render()

  document.dispatchEvent(new Event('astro:page-load'))

  expect(coffee.hidden).toBe(true)
  expect(beer.hidden).toBe(false)
})

it('stops switching when the visit releases', async () => {
  setClock(17, 59)
  const { bindCharacters } = await loadCharacters()
  const { coffee, beer } = render()

  const release = bindCharacters()
  release?.()
  vi.advanceTimersByTime(2 * 60 * 1000)

  expect(coffee.hidden).toBe(false)
  expect(beer.hidden).toBe(true)
})

it('returns without arming a timer when the page has no character', async () => {
  setClock(17, 59)
  const { bindCharacters } = await loadCharacters()
  document.body.innerHTML = ''

  expect(bindCharacters()).toBeUndefined()
  expect(vi.getTimerCount()).toBe(0)
})
