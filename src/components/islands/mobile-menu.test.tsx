// @vitest-environment happy-dom
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import type { Mock } from 'vitest'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { MobileMenu } from '~/components/islands/mobile-menu'

const content = {
  label: 'Menu',
  trigger: { open: 'Abrir menu', close: 'Fechar menu' },
}

const nav = [
  { label: 'sobre', href: '#about' },
  { label: 'contato', href: '#contact' },
]

const openMenu = () => {
  const view = render(
    <MobileMenu nav={nav} content={content}>
      <span>extra</span>
    </MobileMenu>,
  )
  fireEvent.click(view.getByLabelText('Abrir menu'))
  return view
}

beforeAll(async () => {
  await import('~/scripts/anchor-nav')
})

let scrollIntoView: Mock<() => void>

beforeEach(() => {
  scrollIntoView = vi.fn()
  Element.prototype.scrollIntoView = scrollIntoView

  const about = document.createElement('section')
  about.id = 'about'
  document.body.appendChild(about)
})

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})

describe('MobileMenu', () => {
  it('takes each item to its section', async () => {
    const { getByText } = openMenu()

    await waitFor(() => {
      expect(getByText('sobre').getAttribute('href')).toBe('#about')
    })
    expect(getByText('contato').getAttribute('href')).toBe('#contact')
  })

  it('closes when an item is chosen', async () => {
    const { getByLabelText, getByText } = openMenu()

    await waitFor(() => {
      expect(getByLabelText('Fechar menu').dataset.state).toBe('open')
    })

    const reachedTheBrowser = fireEvent.click(getByText('sobre'))
    expect(reachedTheBrowser).toBe(false)

    await waitFor(() => {
      expect(getByLabelText('Abrir menu').dataset.state).toBe('closed')
    })
  })

  it('closes when an item is reached by the keyboard', async () => {
    const { getByLabelText, getByText } = openMenu()

    await waitFor(() => {
      expect(getByLabelText('Fechar menu').dataset.state).toBe('open')
    })

    const menu = getByText('sobre').closest('[role="menu"]') as HTMLElement
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    await waitFor(() => {
      expect(getByText('sobre').dataset.highlighted).toBeDefined()
    })

    fireEvent.keyDown(menu, { key: 'Enter' })

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledTimes(1)
    })
    await waitFor(() => {
      expect(getByLabelText('Abrir menu').dataset.state).toBe('closed')
    })
  })

  it('marks the root element while open so the page scroll locks', async () => {
    const { getByLabelText } = openMenu()

    await waitFor(() => {
      expect(document.documentElement.dataset.menu).toBe('open')
    })

    fireEvent.click(getByLabelText('Fechar menu'))

    await waitFor(() => {
      expect(document.documentElement.dataset.menu).toBeUndefined()
    })
  })

  it('closes when the router swaps the page', async () => {
    const { getByLabelText } = openMenu()

    await waitFor(() => {
      expect(getByLabelText('Fechar menu').dataset.state).toBe('open')
    })

    document.dispatchEvent(new Event('astro:before-swap'))

    await waitFor(() => {
      expect(getByLabelText('Abrir menu').dataset.state).toBe('closed')
    })
  })
})
