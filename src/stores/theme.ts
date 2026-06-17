import { atom } from 'nanostores'

type Theme = 'dark' | 'light'

function readTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'dark'
  }

  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export const $theme = atom<Theme>(readTheme())

export function toggleTheme() {
  const next: Theme = $theme.get() === 'dark' ? 'light' : 'dark'
  const root = document.documentElement

  root.setAttribute('data-theme-switching', '')
  root.dataset.theme = next

  try {
    localStorage.setItem('theme', next)
  } catch {}

  $theme.set(next)

  requestAnimationFrame(() =>
    requestAnimationFrame(() => root.removeAttribute('data-theme-switching')),
  )
}
