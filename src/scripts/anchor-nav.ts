import { goToAnchor, scrollToTop } from '~/helpers/anchor'

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

    if (href.startsWith('#')) {
      if (href === '#') return
      if (goToAnchor(href.slice(1))) event.preventDefault()
      return
    }

    const url = new URL(link.href)
    if (
      url.origin === location.origin &&
      url.pathname === location.pathname &&
      !url.hash
    ) {
      event.preventDefault()
      scrollToTop()
    }
  },
  { capture: true },
)

if (location.hash) {
  goToAnchor(location.hash.slice(1))
}
