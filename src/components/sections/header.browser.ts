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

    describe('open menu layout', () => {
      afterEach(() => {
        document.documentElement.removeAttribute('data-menu')
      })

      async function openMenu(width: number) {
        await mountHeader(width)
        document.documentElement.dataset.menu = 'open'
      }

      const rem = () =>
        Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
      const links = () => [
        ...document.querySelectorAll<HTMLElement>(
          '[data-menu-surface] nav[aria-label] a',
        ),
      ]

      it('sets the links in Geist 2.25rem at weight 400 with a 0.75rem gap at 375px', async () => {
        await openMenu(375)

        const [first, second] = links()
        const style = getComputedStyle(first as Element)
        expect(Number.parseFloat(style.fontSize)).toBe(2.25 * rem())
        expect(style.fontWeight).toBe('400')
        expect(style.fontFamily).not.toMatch(/mono/i)
        const gap =
          (second.parentElement as Element).getBoundingClientRect().top -
          (first.parentElement as Element).getBoundingClientRect().bottom
        expect(gap).toBe(0.75 * rem())
      })

      it('aligns the list with the logo and sits it 6rem above the bottom at 375px', async () => {
        await openMenu(375)

        const logo = document.querySelector(
          '[data-menu-surface] a svg',
        ) as Element
        const list = document.querySelector(
          '[data-menu-surface] nav[aria-label] ul',
        ) as Element
        expect(list.getBoundingClientRect().left).toBe(
          logo.getBoundingClientRect().left,
        )
        expect(800 - list.getBoundingClientRect().bottom).toBeCloseTo(
          6 * rem(),
          0,
        )
      })

      const toggleSelector = '[aria-pressed], a[href^="/en"]'

      it('shows the toggles in the navigation area at 360px', async () => {
        await openMenu(360)

        const area = document.querySelector(
          '[data-menu-surface] nav[aria-label]',
        ) as Element
        const toggles = area.querySelectorAll(toggleSelector)
        expect(toggles.length).toBe(2)
        for (const toggle of toggles) {
          expect(toggle.getBoundingClientRect().width).toBeGreaterThan(0)
        }
      })

      it.each([false, true])(
        'keeps the toggles in the pill row at 400px, menu open: %s',
        async (open) => {
          await mountHeader(400)
          if (open) document.documentElement.dataset.menu = 'open'

          const area = document.querySelector('nav[aria-label]') as Element
          const row = [
            ...document.querySelectorAll<HTMLElement>(toggleSelector),
          ].filter((toggle) => !area.contains(toggle))
          expect(row.length).toBe(2)
          for (const toggle of row) {
            const box = toggle.getBoundingClientRect()
            expect(box.width).toBeGreaterThan(0)
            expect(box.top).toBeLessThan(4 * rem())
          }
          for (const toggle of area.querySelectorAll(toggleSelector)) {
            expect(toggle.getBoundingClientRect().width).toBe(0)
          }
        },
      )
    })
  })
})
