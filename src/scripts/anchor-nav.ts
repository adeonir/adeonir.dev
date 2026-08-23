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

// Set by @zag-js/remove-scroll while a modal overlay holds the page, and
// removed only after it restores the original offset. On iOS the lock pins the
// body with position: fixed, so a scroll started underneath it is discarded.
const SCROLL_LOCK_ATTRIBUTE = 'data-scroll-lock'

const whenScrollUnlocked = (scroll: () => void) => {
  if (!document.body.hasAttribute(SCROLL_LOCK_ATTRIBUTE)) {
    scroll()
    return
  }

  const observer = new MutationObserver(() => {
    if (document.body.hasAttribute(SCROLL_LOCK_ATTRIBUTE)) return
    observer.disconnect()
    requestAnimationFrame(scroll)
  })

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: [SCROLL_LOCK_ATTRIBUTE],
  })
}

// Bubble phase, never capture: a capture-phase preventDefault() reaches
// component handlers as an already-cancelled event, and Ark UI declines to act
// on those, so a link inside an open popover would never close it.
document.addEventListener('click', (event) => {
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
    const id = href.slice(1)
    whenScrollUnlocked(() => {
      if (scrollToId(id)) stripHash()
    })
    return
  }

  const url = new URL(link.href)
  if (
    url.origin === location.origin &&
    url.pathname === location.pathname &&
    !url.hash
  ) {
    event.preventDefault()
    whenScrollUnlocked(() => {
      window.scrollTo({ top: 0, behavior: behavior() })
    })
  }
})

if (location.hash) {
  const id = location.hash.slice(1)
  requestAnimationFrame(() => {
    if (scrollToId(id)) stripHash()
  })
}
