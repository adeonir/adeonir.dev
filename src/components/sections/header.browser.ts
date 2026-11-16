import '~/styles/global.css'

import { afterEach, describe, expect, it } from 'vitest'
import { commands, page } from 'vitest/browser'

declare module 'vitest/browser' {
  interface BrowserCommands {
    renderHeader: (pathname: string) => Promise<string>
    emulateReducedMotion: (reduce: boolean) => Promise<void>
  }
}

async function mountHeader(width: number) {
  await page.viewport(width, 800)
  document.body.innerHTML = await commands.renderHeader('/')
}

describe('header pill', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it.each([360, 375, 400])(
    'is 3.5rem tall with a radius of half its height at %ipx',
    async (width) => {
      await mountHeader(width)

      const pill = document.querySelector('header .rounded-full')
      expect(window.innerWidth).toBe(width)
      expect(pill).not.toBeNull()

      const style = getComputedStyle(pill as Element)
      const rem = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      )

      expect(Number.parseFloat(style.height)).toBe(3.5 * rem)
      expect(
        Number.parseFloat(style.borderTopLeftRadius),
      ).toBeGreaterThanOrEqual((3.5 * rem) / 2)
    },
  )

  describe('menu surface at 375px', () => {
    afterEach(() => {
      document.documentElement.removeAttribute('data-menu')
    })

    it('hides the menu links while closed', async () => {
      await mountHeader(375)

      const link = document.querySelector(
        '[data-menu-surface] [data-menu-link]',
      )
      expect(getComputedStyle(link as Element).visibility).toBe('hidden')
    })

    it('lets a tap through beside the pill while closed', async () => {
      await mountHeader(375)

      const surface = document.querySelector('[data-menu-surface]') as Element
      const hit = document.elementFromPoint(187, 400)
      expect(surface.contains(hit)).toBe(false)
    })

    it('covers the viewport with an opaque square surface when open', async () => {
      await mountHeader(375)
      document.documentElement.dataset.menu = 'open'

      const surface = document.querySelector('[data-menu-surface]') as Element
      const style = getComputedStyle(surface)
      const box = surface.getBoundingClientRect()

      expect(style.clipPath).toBe('inset(0px)')
      expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
      expect(box.width).toBe(
        (document.querySelector('header') as Element).getBoundingClientRect()
          .width,
      )
      expect(box.height).toBe(800)
      const link = document.querySelector(
        '[data-menu-surface] [data-menu-link]',
      )
      expect(getComputedStyle(link as Element).visibility).toBe('visible')
    })
  })

  describe('menu animation', () => {
    const open = () => {
      document.documentElement.dataset.menu = 'open'
    }
    const close = () => {
      document.documentElement.removeAttribute('data-menu')
    }
    const surface = () =>
      document.querySelector('[data-menu-surface]') as Element
    const links = () =>
      [
        ...document.querySelectorAll('[data-menu-surface] [data-menu-link]'),
      ] as Element[]
    // Reads one transitioned property as [duration, delay, easing] in ms.
    const timing = (element: Element, property: string) => {
      const style = getComputedStyle(element)
      const names = style.transitionProperty.split(', ')
      const at = names.indexOf(property)
      const seconds = (list: string) =>
        (Number.parseFloat(list.split(/, (?![^(]*\))/)[at]) || 0) * 1000
      return [
        seconds(style.transitionDuration),
        seconds(style.transitionDelay),
        style.transitionTimingFunction.split(/, (?![^(]*\))/)[at],
      ] as const
    }
    const easeOut = 'cubic-bezier(0.33, 1, 0.68, 1)'
    const easeIn = 'cubic-bezier(0.32, 0, 0.67, 0)'

    afterEach(async () => {
      close()
      await commands.emulateReducedMotion(false)
    })

    it('grows the surface in 500ms and shrinks it in 350ms', async () => {
      await mountHeader(375)

      expect(timing(surface(), 'clip-path')).toEqual([350, 0, easeIn])
      open()
      expect(timing(surface(), 'clip-path')).toEqual([500, 0, easeOut])
    })

    it('keeps the surface opaque until it has shrunk back to the pill', async () => {
      await mountHeader(375)

      expect(timing(surface(), 'background-color')[1]).toBe(350)
      open()
      expect(timing(surface(), 'background-color')[1]).toBe(0)
    })

    it('starts the links 200ms in, 70ms apart, rising over 400ms', async () => {
      await mountHeader(375)
      open()

      const all = links()
      expect(all.length).toBeGreaterThan(1)
      all.forEach((link, index) => {
        expect(timing(link, 'opacity')).toEqual([
          400,
          200 + index * 70,
          easeOut,
        ])
        expect(timing(link, 'transform')).toEqual([
          400,
          200 + index * 70,
          easeOut,
        ])
      })
      close()
      await new Promise((resolve) => setTimeout(resolve, 150))
      expect(getComputedStyle(all[0]).opacity).toBe('0')
      expect(getComputedStyle(all[0]).transform).toBe(
        'matrix(1, 0, 0, 1, 0, 8)',
      )
    })

    it('exits the links together in 100ms with an ease-in', async () => {
      await mountHeader(375)
      open()
      close()

      for (const link of links()) {
        expect(timing(link, 'opacity')).toEqual([100, 0, 'ease-in'])
        expect(timing(link, 'transform')).toEqual([100, 0, 'ease-in'])
      }
    })

    it('hides the links from Tab only after the closing transition', async () => {
      await mountHeader(375)
      const nav = document.querySelector('[data-menu-surface] nav[aria-label]')

      open()
      expect(timing(nav as Element, 'visibility')[1]).toBe(0)
      close()
      expect(timing(nav as Element, 'visibility')[1]).toBe(350)
    })

    it('fades the background and links in 150ms and out in 100ms with reduced motion', async () => {
      await commands.emulateReducedMotion(true)
      await mountHeader(375)

      expect(timing(surface(), 'background-color')).toEqual([100, 0, 'ease-in'])
      expect(timing(surface(), 'clip-path')).toEqual([0, 100, 'linear'])
      for (const link of links()) {
        expect(timing(link, 'opacity')).toEqual([100, 0, 'ease-in'])
        expect(getComputedStyle(link).transform).toBe('none')
      }

      open()
      expect(timing(surface(), 'background-color')).toEqual([
        150,
        0,
        'ease-out',
      ])
      expect(timing(surface(), 'clip-path')[0]).toBe(0)
      for (const link of links()) {
        expect(timing(link, 'opacity')).toEqual([150, 0, 'ease-out'])
        expect(getComputedStyle(link).transform).toBe('none')
      }
    })

    it('runs no animation at 48rem and wider', async () => {
      await mountHeader(800)
      open()

      expect(timing(surface(), 'clip-path')[0]).toBe(0)
      close()
      expect(timing(surface(), 'clip-path')[0]).toBe(0)
    })
  })
})
