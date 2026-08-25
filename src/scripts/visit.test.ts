// @vitest-environment happy-dom

import { beforeEach, expect, it, vi } from 'vitest'

const loadVisit = async () => {
  vi.resetModules()
  return import('./visit')
}

const load = () => {
  document.dispatchEvent(new Event('astro:page-load'))
}

const navigate = () => {
  document.dispatchEvent(new Event('astro:before-swap'))
  document.dispatchEvent(new Event('astro:page-load'))
}

beforeEach(() => {
  vi.restoreAllMocks()
})

it('binds when the first load completes', async () => {
  const { onVisit } = await loadVisit()
  const bind = vi.fn()

  onVisit(bind)
  expect(bind).not.toHaveBeenCalled()

  load()
  expect(bind).toHaveBeenCalledTimes(1)
})

it('binds a script that subscribes after the load completed', async () => {
  const { onVisit } = await loadVisit()
  const bind = vi.fn()

  load()
  onVisit(bind)

  expect(bind).toHaveBeenCalledTimes(1)
})

it('releases before the swap and binds again on the next visit', async () => {
  const { onVisit } = await loadVisit()
  const release = vi.fn()
  const bind = vi.fn(() => release)

  onVisit(bind)
  load()
  navigate()

  expect(release).toHaveBeenCalledTimes(1)
  expect(bind).toHaveBeenCalledTimes(2)
})

it('releases each visit once', async () => {
  const { onVisit } = await loadVisit()
  const release = vi.fn()

  onVisit(() => release)
  load()
  navigate()
  navigate()

  expect(release).toHaveBeenCalledTimes(2)
})

it('releases the rest when one release throws', async () => {
  const { onVisit } = await loadVisit()
  const release = vi.fn()

  onVisit(() => () => {
    throw new Error('release failed')
  })
  onVisit(() => release)

  load()
  document.dispatchEvent(new Event('astro:before-swap'))

  expect(release).toHaveBeenCalledTimes(1)

  document.dispatchEvent(new Event('astro:page-load'))
  document.dispatchEvent(new Event('astro:before-swap'))

  expect(release).toHaveBeenCalledTimes(2)
})

it('keeps a bind without a release', async () => {
  const { onVisit } = await loadVisit()
  const bind = vi.fn()

  onVisit(bind)
  load()
  navigate()

  expect(bind).toHaveBeenCalledTimes(2)
})
