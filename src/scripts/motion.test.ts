// @vitest-environment happy-dom

import { beforeEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  inView: vi.fn(),
  animate: vi.fn(),
}))

vi.mock('motion', () => ({ inView: mocks.inView }))
vi.mock('motion/mini', () => ({ animate: mocks.animate }))

type Enter = () => void

const stopWatching = vi.fn()
const stopAnimation = vi.fn()

let entries: { section: Element; enter: Enter; options: { margin?: string } }[]

const loadEnter = async () => {
  vi.resetModules()
  return import('./motion')
}

const render = () => {
  document.body.innerHTML = `
    <main>
      <section>
        <p data-enter="block" id="loose">outside a section with an id</p>
      </section>
      <section id="about">
        <h2 data-enter="block" id="headline">headline</h2>
        <p data-enter="block" id="bio">bio</p>
        <div data-enter="block" id="group">
          <ul>
            <li data-enter="row" id="row-a">first</li>
            <li data-enter="row" id="row-b">second</li>
          </ul>
        </div>
        <p id="unmarked">unmarked</p>
      </section>
      <section id="stack">
        <p data-enter="block" id="tools">tools</p>
      </section>
    </main>
  `
}

const at = (id: string) =>
  document.querySelector<HTMLElement>(`#${id}`) as HTMLElement

const allowMotion = (reduce: boolean) => {
  vi.stubGlobal('matchMedia', () => ({ matches: reduce }))
}

const settledBy = (enter: Enter) => {
  enter()
  return mocks.animate.mock.calls.map(([element, values, options]) => [
    (element as HTMLElement).id,
    (values as { transform: string }).transform,
    (options as { delay: number }).delay,
  ])
}

beforeEach(() => {
  entries = []
  stopWatching.mockClear()
  stopAnimation.mockClear()
  mocks.inView.mockReset()
  mocks.animate.mockReset()

  mocks.inView.mockImplementation(
    (section: Element, enter: Enter, options: { margin?: string }) => {
      entries.push({ section, enter, options })
      return stopWatching
    },
  )
  mocks.animate.mockReturnValue({ stop: stopAnimation })

  allowMotion(false)
  render()
})

it('holds every marked block of a section with an id at bind', async () => {
  const { bindEnter } = await loadEnter()

  bindEnter()

  expect(at('headline').style.opacity).toBe('0')
  expect(at('headline').style.transform).toBe('translateY(16px)')
  expect(at('bio').style.transform).toBe('translateY(16px)')
  expect(at('tools').style.transform).toBe('translateY(16px)')
})

it('rises a row half the distance of a block', async () => {
  const { bindEnter } = await loadEnter()

  bindEnter()

  expect(at('row-a').style.opacity).toBe('0')
  expect(at('row-a').style.transform).toBe('translateY(8px)')
})

it('leaves an unmarked element and a section with no id alone', async () => {
  const { bindEnter } = await loadEnter()

  bindEnter()

  expect(at('unmarked').style.opacity).toBe('')
  expect(at('loose').style.opacity).toBe('')
})

it('watches each section with an id from a quarter above its top', async () => {
  const { bindEnter } = await loadEnter()

  bindEnter()

  expect(entries.map(({ section }) => section.id)).toEqual(['about', 'stack'])
  expect(entries[0].options.margin).toBe('0px 0px -25% 0px')
})

it('starts each block of a section after the block before it', async () => {
  const { bindEnter } = await loadEnter()

  bindEnter()

  expect(settledBy(entries[0].enter)).toEqual([
    ['headline', 'translateY(0px)', 0],
    ['bio', 'translateY(0px)', 0.07],
    ['group', 'translateY(0px)', 0.14],
    ['row-a', 'translateY(0px)', 0.21],
    ['row-b', 'translateY(0px)', 0.28],
  ])
})

it('starts the rows of a list after the block that holds them', async () => {
  document.body.innerHTML = `
    <main>
      <section id="stack">
        <h2 data-enter="block" id="headline">headline</h2>
        <div data-enter="block" id="first"><ul><li data-enter="row" id="first-row">a</li></ul></div>
        <div data-enter="block" id="second"><ul><li data-enter="row" id="second-row">b</li></ul></div>
      </section>
    </main>
  `

  const { bindEnter } = await loadEnter()

  bindEnter()

  expect(settledBy(entries[0].enter)).toEqual([
    ['headline', 'translateY(0px)', 0],
    ['first', 'translateY(0px)', 0.07],
    ['first-row', 'translateY(0px)', 0.14],
    ['second', 'translateY(0px)', 0.14],
    ['second-row', 'translateY(0px)', 0.21],
  ])
})

it('carries the duration and the curve of the design on every block', async () => {
  const { bindEnter } = await loadEnter()

  bindEnter()
  entries[0].enter()

  const [, , options] = mocks.animate.mock.calls[0]

  expect(options).toMatchObject({ duration: 0.4, ease: [0.33, 1, 0.68, 1] })
})

it('settles a section once even when it enters again', async () => {
  const { bindEnter } = await loadEnter()

  bindEnter()
  entries[0].enter()
  entries[0].enter()

  expect(mocks.animate).toHaveBeenCalledTimes(5)
})

it('leaves a section it has not reached in its starting state', async () => {
  const { bindEnter } = await loadEnter()

  bindEnter()
  entries[0].enter()

  expect(at('tools').style.opacity).toBe('0')
})

it('holds nothing and watches nothing when the reader asks for reduced motion', async () => {
  allowMotion(true)

  const { bindEnter } = await loadEnter()

  const cancel = bindEnter()

  expect(at('headline').style.opacity).toBe('')
  expect(mocks.inView).not.toHaveBeenCalled()
  expect(cancel).toBeUndefined()
})

it('holds nothing when the page carries no marked block', async () => {
  document.body.innerHTML =
    '<main><section id="about"><p>plain</p></section></main>'

  const { bindEnter } = await loadEnter()

  expect(bindEnter()).toBeUndefined()
})

it('stops watching, stops animating, and clears every block when the visit releases', async () => {
  const { bindEnter } = await loadEnter()

  const cancel = bindEnter()
  entries[0].enter()
  cancel?.()

  expect(stopWatching).toHaveBeenCalledTimes(2)
  expect(stopAnimation).toHaveBeenCalledTimes(5)
  expect(at('headline').style.opacity).toBe('')
  expect(at('headline').style.transform).toBe('')
  expect(at('tools').style.opacity).toBe('')
})
