const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const behavior = (): ScrollBehavior =>
  prefersReducedMotion() ? 'auto' : 'smooth'

export const ANCHOR_SCROLL_EVENT = 'anchor-scroll'

const announce = () => {
  document.dispatchEvent(new Event(ANCHOR_SCROLL_EVENT))
}

const stripHash = () => {
  history.replaceState(null, '', location.pathname + location.search)
}

export const scrollToTop = () => {
  announce()
  window.scrollTo({ top: 0, behavior: behavior() })
}

export const goToAnchor = (id: string): boolean => {
  if (!id) return false
  const target = document.getElementById(id)
  if (!target) return false

  stripHash()
  announce()
  target.scrollIntoView({ behavior: behavior() })
  return true
}
