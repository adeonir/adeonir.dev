import type { Locale } from '~/helpers/content'
import { getLocalizedPath } from '~/helpers/locale-path'

import { onVisit } from './visit'

const targetLocaleForPath = (pathname: string): Locale =>
  pathname === '/en' || pathname.startsWith('/en/') ? 'pt' : 'en'

export const syncLanguageLinks = () => {
  const targetLocale = targetLocaleForPath(location.pathname)
  const href = `${getLocalizedPath(location.pathname, targetLocale)}${location.search}`

  document
    .querySelectorAll<HTMLAnchorElement>('[data-language-link]')
    .forEach((link) => {
      link.setAttribute('href', href)
    })
}

let pendingScrollY: number | null = null

const opensInThisTab = (event: MouseEvent) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey

const rememberScrollPosition = (event: MouseEvent) => {
  const node = event.target
  if (!(node instanceof Element)) return

  const startsLanguageVisit =
    opensInThisTab(event) && Boolean(node.closest('[data-language-link]'))

  pendingScrollY = startsLanguageVisit ? window.scrollY : null
}

export const restoreScrollPosition = () => {
  if (pendingScrollY === null) return

  const top = pendingScrollY
  pendingScrollY = null
  window.scrollTo({ top, behavior: 'auto' })
}

document.addEventListener('click', rememberScrollPosition, { capture: true })
document.addEventListener('astro:after-swap', restoreScrollPosition)

onVisit(() => {
  syncLanguageLinks()
  return undefined
})
