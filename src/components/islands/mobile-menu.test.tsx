// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('motion/mini', () => ({ animate: mocks.animate }))

import { MobileMenu } from '~/components/islands/mobile-menu'

const mocks = vi.hoisted(() => ({ animate: vi.fn() }))

const content = { trigger: { open: 'Abrir menu', close: 'Fechar menu' } }

let widthListener: ((event: { matches: boolean }) => void) | undefined

beforeEach(() => {
  mocks.animate.mockClear()
  widthListener = undefined
  vi.stubGlobal('matchMedia', () => ({
    addEventListener: (_: string, listener: typeof widthListener) => {
      widthListener = listener
    },
    removeEventListener: () => {
      widthListener = undefined
    },
  }))
  document.body.innerHTML = `
    <main></main>
    <footer></footer>
    <div data-menu-surface><nav><a data-menu-link href="#about">About</a><a data-menu-link href="/other#about">Other</a></nav></div>
  `
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  document.documentElement.removeAttribute('data-menu')
  document.body.innerHTML = ''
})

function button(name: string) {
  return screen.getByRole('button', { name })
}

describe('MobileMenu', () => {
  it('opens and closes through the button', () => {
    render(<MobileMenu content={content} />)

    fireEvent.click(button('Abrir menu'))

    const open = button('Fechar menu')
    expect(open.getAttribute('aria-expanded')).toBe('true')
    expect(document.documentElement.dataset.menu).toBe('open')

    open.focus()
    fireEvent.click(open)

    const closed = button('Abrir menu')
    expect(closed.getAttribute('aria-expanded')).toBe('false')
    expect(document.documentElement.dataset.menu).toBeUndefined()
    expect(document.activeElement).toBe(closed)
  })

  it('makes main and footer inert only while open', () => {
    render(<MobileMenu content={content} />)
    const main = document.querySelector('main') as HTMLElement
    const footer = document.querySelector('footer') as HTMLElement

    fireEvent.click(button('Abrir menu'))
    expect(main.inert).toBe(true)
    expect(footer.inert).toBe(true)

    fireEvent.click(button('Fechar menu'))
    expect(main.inert).toBe(false)
    expect(footer.inert).toBe(false)
  })

  it('closes on Escape and returns focus to the button', () => {
    render(<MobileMenu content={content} />)
    fireEvent.click(button('Abrir menu'))

    fireEvent.keyDown(document, { key: 'Escape' })

    const closed = button('Abrir menu')
    expect(closed.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(closed)
  })

  it('closes when a navigation link is activated and returns focus', () => {
    render(<MobileMenu content={content} />)
    fireEvent.click(button('Abrir menu'))

    fireEvent.click(screen.getByRole('link', { name: 'About', hidden: true }))

    const closed = button('Abrir menu')
    expect(closed.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(closed)
  })

  it('keeps the menu open and focus unchanged for a link to another page', () => {
    render(<MobileMenu content={content} />)
    const toggle = button('Abrir menu')
    fireEvent.click(toggle)
    const other = screen.getByRole('link', { name: 'Other', hidden: true })
    other.focus()

    fireEvent.click(other)

    expect(button('Fechar menu').getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(other)
  })

  it('closes when the viewport reaches 48rem and stays closed', () => {
    render(<MobileMenu content={content} />)
    fireEvent.click(button('Abrir menu'))

    act(() => widthListener?.({ matches: true }))
    expect(button('Abrir menu').getAttribute('aria-expanded')).toBe('false')

    act(() => widthListener?.({ matches: false }))
    expect(button('Abrir menu').getAttribute('aria-expanded')).toBe('false')
  })

  it('enters the links 250ms in, 70ms apart, rising 8px over 400ms', () => {
    render(<MobileMenu content={content} />)
    const links = [...document.querySelectorAll('[data-menu-link]')]

    fireEvent.click(button('Abrir menu'))

    const ease = [0.33, 1, 0.68, 1]
    expect(mocks.animate).toHaveBeenCalledTimes(2)
    links.forEach((link, index) => {
      expect(mocks.animate).toHaveBeenCalledWith(
        link,
        { opacity: [0, 1], transform: ['translateY(8px)', 'none'] },
        { duration: 0.4, delay: 0.25 + index * 0.07, ease },
      )
    })
  })

  it('exits the links together in 100ms with an ease-in', () => {
    render(<MobileMenu content={content} />)
    const links = [...document.querySelectorAll('[data-menu-link]')]
    fireEvent.click(button('Abrir menu'))
    mocks.animate.mockClear()

    fireEvent.click(button('Fechar menu'))

    expect(mocks.animate).toHaveBeenCalledTimes(2)
    for (const link of links) {
      expect(mocks.animate).toHaveBeenCalledWith(
        link,
        { opacity: 0 },
        { duration: 0.1, ease: 'easeIn' },
      )
    }
  })

  it('does not animate on mount', () => {
    render(<MobileMenu content={content} />)

    expect(mocks.animate).not.toHaveBeenCalled()
  })

  describe('page navigation', () => {
    function prepare(loader: () => Promise<void>) {
      return Object.assign(new Event('astro:before-preparation'), { loader })
    }

    function finishClosing() {
      const surface = document.querySelector('[data-menu-surface]') as Element
      act(() => {
        surface.dispatchEvent(
          Object.assign(new Event('transitionend'), {
            propertyName: 'background-color',
          }),
        )
      })
    }

    it('ignores a transition that ends inside the surface', async () => {
      render(<MobileMenu content={content} />)
      fireEvent.click(button('Abrir menu'))
      const event = prepare(() => Promise.resolve())
      act(() => {
        document.dispatchEvent(event)
      })

      let done = false
      const run = event.loader().then(() => {
        done = true
      })
      const link = document.querySelector('[data-menu-link]') as Element
      act(() => {
        link.dispatchEvent(
          Object.assign(new Event('transitionend', { bubbles: true }), {
            propertyName: 'opacity',
          }),
        )
      })
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(done).toBe(false)

      finishClosing()
      await run
      expect(done).toBe(true)
    })

    it('waits for the background after the shrink', async () => {
      render(<MobileMenu content={content} />)
      fireEvent.click(button('Abrir menu'))
      const event = prepare(() => Promise.resolve())
      act(() => {
        document.dispatchEvent(event)
      })

      let done = false
      const run = event.loader().then(() => {
        done = true
      })
      const surface = document.querySelector('[data-menu-surface]') as Element
      act(() => {
        surface.dispatchEvent(
          Object.assign(new Event('transitionend'), {
            propertyName: 'clip-path',
          }),
        )
      })
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(done).toBe(false)

      finishClosing()
      await run
      expect(done).toBe(true)
    })

    it('closes the menu and holds the page load until the closing animation ends', async () => {
      render(<MobileMenu content={content} />)
      fireEvent.click(button('Abrir menu'))
      const loader = vi.fn(() => Promise.resolve())
      const event = prepare(loader)

      act(() => {
        document.dispatchEvent(event)
      })
      expect(button('Abrir menu').getAttribute('aria-expanded')).toBe('false')

      let done = false
      const run = event.loader().then(() => {
        done = true
      })
      await Promise.resolve()
      expect(loader).toHaveBeenCalledTimes(1)
      expect(done).toBe(false)

      finishClosing()
      await run
      expect(done).toBe(true)
    })

    it('holds the page load until the load itself has finished', async () => {
      render(<MobileMenu content={content} />)
      fireEvent.click(button('Abrir menu'))
      let finishLoad = () => {}
      const event = prepare(
        () => new Promise<void>((resolve) => (finishLoad = resolve)),
      )
      act(() => {
        document.dispatchEvent(event)
      })

      let done = false
      const run = event.loader().then(() => {
        done = true
      })
      finishClosing()
      await Promise.resolve()
      await Promise.resolve()
      expect(done).toBe(false)

      finishLoad()
      await run
      expect(done).toBe(true)
    })

    it('resolves under reduced motion when only the background transitions', async () => {
      vi.stubGlobal('matchMedia', (query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        addEventListener: () => {},
        removeEventListener: () => {},
      }))
      render(<MobileMenu content={content} />)
      fireEvent.click(button('Abrir menu'))
      const event = prepare(() => Promise.resolve())
      act(() => {
        document.dispatchEvent(event)
      })

      const surface = document.querySelector('[data-menu-surface]') as Element
      act(() => {
        surface.dispatchEvent(
          Object.assign(new Event('transitionend'), {
            propertyName: 'background-color',
          }),
        )
      })

      await event.loader()
    })

    it('resolves when no transition runs at all', async () => {
      vi.useFakeTimers()
      try {
        render(<MobileMenu content={content} />)
        fireEvent.click(button('Abrir menu'))
        const event = prepare(() => Promise.resolve())
        act(() => {
          document.dispatchEvent(event)
        })

        const run = event.loader()
        await vi.advanceTimersByTimeAsync(400)
        await run
      } finally {
        vi.useRealTimers()
      }
    })

    it('leaves the loader alone when the menu is closed', async () => {
      render(<MobileMenu content={content} />)
      const loader = vi.fn(() => Promise.resolve())
      const event = prepare(loader)

      act(() => {
        document.dispatchEvent(event)
      })

      expect(event.loader).toBe(loader)
    })

    it('closes at once when the swap starts with the menu open', () => {
      render(<MobileMenu content={content} />)
      fireEvent.click(button('Abrir menu'))

      act(() => {
        document.dispatchEvent(new Event('astro:before-swap'))
      })

      expect(button('Abrir menu').getAttribute('aria-expanded')).toBe('false')
      expect(document.documentElement.dataset.menu).toBeUndefined()
      expect((document.querySelector('main') as HTMLElement).inert).toBe(false)
    })
  })
})
