import '~/styles/global.css'

import { afterEach, describe, expect, it } from 'vitest'
import { commands, page } from 'vitest/browser'

declare module 'vitest/browser' {
  interface BrowserCommands {
    renderHeader: (pathname: string) => Promise<string>
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
        '[data-menu-surface] nav[aria-label] a',
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
        '[data-menu-surface] nav[aria-label] a',
      )
      expect(getComputedStyle(link as Element).visibility).toBe('visible')
    })
  })
})
