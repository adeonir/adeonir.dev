const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const behavior = (): ScrollBehavior =>
  prefersReducedMotion() ? 'auto' : 'smooth'

const scrollToId = (id: string): boolean => {
  if (!id) return false
  const target = document.getElementById(id)
  if (!target) return false
  target.scrollIntoView({ behavior: behavior() })
  return true
}

const stripHash = () => {
  history.replaceState(null, '', location.pathname + location.search)
}

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
      event.preventDefault()
      if (scrollToId(href.slice(1))) stripHash()
      return
    }

    const url = new URL(link.href)
    if (
      url.origin === location.origin &&
      url.pathname === location.pathname &&
      !url.hash
    ) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: behavior() })
    }
  },
  { capture: true },
)

if (location.hash) {
  const id = location.hash.slice(1)
  requestAnimationFrame(() => {
    if (scrollToId(id)) stripHash()
  })
}
