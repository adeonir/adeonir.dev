const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const behavior = (): ScrollBehavior =>
  prefersReducedMotion() ? 'auto' : 'smooth'

const stripHash = () => {
  history.replaceState(null, '', location.pathname + location.search)
}

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: behavior() })
}

export const goToAnchor = (id: string): boolean => {
  if (!id) return false
  const target = document.getElementById(id)
  if (!target) return false

  stripHash()
  target.scrollIntoView({ behavior: behavior() })
  return true
}
