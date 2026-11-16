import { atom } from 'nanostores'

type Theme = 'dark' | 'light'

export function readTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'dark'
  }

  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export const $theme = atom<Theme>(readTheme())

// Safari paints its bars from this meta. The values mirror the `background`
// and `header` tokens of each skin, since the meta cannot read CSS variables.
const themeColors = {
  dark: { page: '#1e1e2e', menu: '#151521' },
  light: { page: '#eff1f5', menu: '#e0e3eb' },
}

export function syncThemeColor() {
  const surface =
    document.documentElement.dataset.menu === 'open' ? 'menu' : 'page'
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', themeColors[readTheme()][surface])
}

export function toggleTheme() {
  const next: Theme = $theme.get() === 'dark' ? 'light' : 'dark'
  const root = document.documentElement

  root.setAttribute('data-theme-switching', '')
  root.dataset.theme = next
  syncThemeColor()

  try {
    localStorage.setItem('theme', next)
  } catch {}

  $theme.set(next)

  requestAnimationFrame(() =>
    requestAnimationFrame(() => root.removeAttribute('data-theme-switching')),
  )
}
