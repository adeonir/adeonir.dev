import { atom, onMount } from 'nanostores'

type Theme = 'dark' | 'light'

export const $theme = atom<Theme>('dark')

onMount($theme, () => {
  $theme.set(
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )
})

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
