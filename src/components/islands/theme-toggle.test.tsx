// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Window } from 'happy-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeToggle } from '~/components/islands/theme-toggle'
import { $theme } from '~/stores/theme'

const labels = {
  label: 'Light theme',
  switchToLight: 'Switch to light theme',
  switchToDark: 'Switch to dark theme',
}

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.removeAttribute('data-theme-switching')
  vi.stubGlobal(
    'localStorage',
    new Window({ url: 'http://localhost' }).localStorage,
  )
  $theme.set('dark')
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('ThemeToggle', () => {
  it('exposes the active theme through aria-pressed under one fixed label', () => {
    render(<ThemeToggle labels={labels} />)

    const dark = screen.getByRole('button', { name: labels.label })
    expect(dark.getAttribute('aria-pressed')).toBe('false')
    expect(dark.getAttribute('aria-label')).toBe(labels.label)

    fireEvent.click(dark)

    const light = screen.getByRole('button', { name: labels.label })
    expect(light.getAttribute('aria-pressed')).toBe('true')
    expect(light.getAttribute('aria-label')).toBe(labels.label)

    act(() => {
      $theme.set('dark')
    })

    const back = screen.getByRole('button', { name: labels.label })
    expect(back.getAttribute('aria-pressed')).toBe('false')
    expect(back.getAttribute('aria-label')).toBe(labels.label)
  })
})
