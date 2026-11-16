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
})
