import { goToAnchor, scrollToTop } from '~/helpers/anchor'
import { onVisit } from '~/scripts/visit'

document.addEventListener(
  'click',
  (event) => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const node = event.target
    if (!(node instanceof Element)) return

    const link = node.closest<HTMLAnchorElement>('a[href]')
    if (!link || (link.target && link.target !== '_self')) return

    const href = link.getAttribute('href')
    if (!href) return

    const url = new URL(link.href)
    if (url.origin !== location.origin) return
    if (url.pathname !== location.pathname) return

    if (url.hash) {
      if (url.hash === '#') return
      if (goToAnchor(url.hash.slice(1))) event.preventDefault()
      return
    }

    event.preventDefault()
    scrollToTop()
  },
  { capture: true },
)

onVisit(() => {
  if (location.hash) goToAnchor(location.hash.slice(1))
  return undefined
})
