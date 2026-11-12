// @vitest-environment happy-dom

import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ scroll: vi.fn() }))

vi.mock('motion', () => ({ scroll: mocks.scroll }))

const stopScroll = vi.fn()

const HEIGHT = 400
const PINS = [112, 168, 224]

const loadRecede = async () => {
  vi.resetModules()
  return import('./stack-recede')
}

const render = (count: number) => {
  document.body.innerHTML = Array.from(
    { length: count },
    (_, index) =>
      `<div data-stack-card id="card-${index}" style="top: ${PINS[index]}px"><a></a></div>`,
  ).join('')

  for (const surface of document.querySelectorAll('[data-stack-card] > a')) {
    Object.defineProperty(surface, 'offsetHeight', { value: HEIGHT })
  }
}

const at = (id: string) =>
  document.querySelector<HTMLElement>(`#${id}`) as HTMLElement

const placeAt = (id: string, top: number) => {
  at(id).getBoundingClientRect = () => ({ top }) as DOMRect
}

const allowMotion = (reduce: boolean) => {
  vi.stubGlobal('matchMedia', () => ({ matches: reduce }))
}

const onScroll = () => mocks.scroll.mock.calls[0][0] as () => void

beforeEach(() => {
  mocks.scroll.mockReset().mockReturnValue(stopScroll)
  stopScroll.mockReset()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

it('keeps a card at full size until the next card reaches its bottom edge', async () => {
  render(2)
  allowMotion(false)
  placeAt('card-0', 112)
  placeAt('card-1', 512)
  const { bindRecede } = await loadRecede()

  bindRecede()
  onScroll()()

  expect(at('card-0').style.transform).toBe('scale(1)')
})

it('shrinks a card in step with how far the next card has slid over it', async () => {
  render(2)
  allowMotion(false)
  placeAt('card-0', 112)
  placeAt('card-1', 340)
  const { bindRecede } = await loadRecede()

  bindRecede()
  onScroll()()

  expect(at('card-0').style.transform).toBe('scale(0.975)')
})

it('holds a card at 95% once the next card pins over it', async () => {
  render(2)
  allowMotion(false)
  placeAt('card-0', 112)
  placeAt('card-1', 168)
  const { bindRecede } = await loadRecede()

  bindRecede()
  onScroll()()

  expect(at('card-0').style.transform).toBe('scale(0.95)')
})

it('shrinks a card 5% more for each card stacked in front of it', async () => {
  render(3)
  allowMotion(false)
  placeAt('card-0', 112)
  placeAt('card-1', 168)
  placeAt('card-2', 224)
  const { bindRecede } = await loadRecede()

  bindRecede()
  onScroll()()

  expect(at('card-0').style.transform).toBe('scale(0.9)')
  expect(at('card-1').style.transform).toBe('scale(0.95)')
})

it('leaves the last card untouched', async () => {
  render(2)
  allowMotion(false)
  placeAt('card-0', 112)
  placeAt('card-1', 168)
  const { bindRecede } = await loadRecede()

  bindRecede()
  onScroll()()

  expect(at('card-1').style.transform).toBe('')
})

it('does nothing when the visitor prefers reduced motion', async () => {
  render(3)
  allowMotion(true)
  const { bindRecede } = await loadRecede()

  expect(bindRecede()).toBeUndefined()
  expect(mocks.scroll).not.toHaveBeenCalled()
})

it('does nothing when there is no card behind another', async () => {
  render(1)
  allowMotion(false)
  const { bindRecede } = await loadRecede()

  expect(bindRecede()).toBeUndefined()
  expect(mocks.scroll).not.toHaveBeenCalled()
})

it('stops tracking the scroll and clears the scale on release', async () => {
  render(2)
  allowMotion(false)
  placeAt('card-0', 112)
  placeAt('card-1', 168)
  const { bindRecede } = await loadRecede()

  const release = bindRecede()
  onScroll()()
  release?.()

  expect(stopScroll).toHaveBeenCalledOnce()
  expect(at('card-0').style.transform).toBe('')
})
