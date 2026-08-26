import { goToAnchor } from '~/helpers/anchor'

import { onVisit } from './visit'

const currentSectionKey = 'language-control:current-section'

export const rememberCurrentSection = (id: string) => {
  if (!id) return

  try {
    sessionStorage.setItem(currentSectionKey, id)
  } catch {
    // Storage can be unavailable in privacy-restricted browsing contexts.
  }
}

export const restoreCurrentSection = () => {
  let id: string | null = null

  try {
    id = sessionStorage.getItem(currentSectionKey)
    sessionStorage.removeItem(currentSectionKey)
  } catch {
    return
  }

  if (id) goToAnchor(id)
}

const rememberAnchorClick = (event: MouseEvent) => {
  const node = event.target
  if (!(node instanceof Element)) return

  const link = node.closest<HTMLAnchorElement>('a[href^="#"]')
  const href = link?.getAttribute('href')
  if (!href || href === '#') return

  rememberCurrentSection(href.slice(1))
}

onVisit(() => {
  restoreCurrentSection()
  document.addEventListener('click', rememberAnchorClick, { capture: true })

  return () => {
    document.removeEventListener('click', rememberAnchorClick, {
      capture: true,
    })
  }
})
