// @vitest-environment happy-dom
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { MobileMenu } from '~/components/islands/mobile-menu'

const content = {
  label: 'Menu',
  trigger: { open: 'Abrir menu', close: 'Fechar menu' },
}

const nav = [{ label: 'sobre', href: '#about' }]

const renderMenu = () =>
  render(
    <MobileMenu nav={nav} content={content}>
      <span>extra</span>
    </MobileMenu>,
  )

const swap = () => document.dispatchEvent(new Event('astro:before-swap'))

afterEach(cleanup)

describe('MobileMenu', () => {
  it('closes when the router swaps the page', async () => {
    const { getByLabelText } = renderMenu()

    fireEvent.click(getByLabelText('Abrir menu'))
    await waitFor(() => {
      expect(getByLabelText('Fechar menu').dataset.state).toBe('open')
    })

    swap()

    await waitFor(() => {
      expect(getByLabelText('Abrir menu').dataset.state).toBe('closed')
    })
  })

  it('releases the page it locked before the swap', async () => {
    const { getByLabelText } = renderMenu()

    fireEvent.click(getByLabelText('Abrir menu'))
    await waitFor(() => {
      expect(document.body.hasAttribute('data-scroll-lock')).toBe(true)
    })

    swap()

    await waitFor(() => {
      expect(document.body.hasAttribute('data-scroll-lock')).toBe(false)
    })
  })
})
