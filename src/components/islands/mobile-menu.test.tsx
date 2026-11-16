// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { MobileMenu } from '~/components/islands/mobile-menu'

const content = { trigger: { open: 'Abrir menu', close: 'Fechar menu' } }

let widthListener: ((event: { matches: boolean }) => void) | undefined

beforeEach(() => {
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
    <div data-menu-surface><nav><a href="#about">About</a><a href="/other#about">Other</a></nav></div>
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

  it('listens for a passive touchstart on the surface only while open', () => {
    const surface = document.querySelector('[data-menu-surface]') as HTMLElement
    const add = vi.spyOn(surface, 'addEventListener')
    const remove = vi.spyOn(surface, 'removeEventListener')
    render(<MobileMenu content={content} />)
    expect(add).not.toHaveBeenCalled()

    fireEvent.click(button('Abrir menu'))
    expect(add).toHaveBeenCalledWith('touchstart', expect.any(Function), {
      passive: true,
    })

    fireEvent.click(button('Fechar menu'))
    expect(remove).toHaveBeenCalledWith('touchstart', expect.any(Function))
  })
})
