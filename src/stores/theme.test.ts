// @vitest-environment happy-dom
import { Window } from 'happy-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { $theme, readTheme, toggleTheme } from '~/stores/theme'

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
  vi.unstubAllGlobals()
})

describe('readTheme', () => {
  it('defaults to dark when no preference is set', () => {
    expect(readTheme()).toBe('dark')
  })

  it('returns light when the document is marked light', () => {
    document.documentElement.dataset.theme = 'light'
    expect(readTheme()).toBe('light')
  })
})

describe('toggleTheme', () => {
  it('flips the active theme to its opposite', () => {
    toggleTheme()
    expect($theme.get()).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')

    toggleTheme()
    expect($theme.get()).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('persists the new theme', () => {
    toggleTheme()
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('still flips when persistence fails', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('storage denied')
    })

    expect(() => toggleTheme()).not.toThrow()
    expect($theme.get()).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
