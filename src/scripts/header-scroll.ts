import { ANCHOR_SCROLL_EVENT } from '~/helpers/anchor'
import { onVisit } from '~/scripts/visit'

// Trackpads and touch report a few pixels of movement in both directions
// while the finger is still; anything under this is ignored.
const THRESHOLD = 8
// A smooth scroll the site started keeps firing scroll events; once they stop
// for this long, the next movement is the visitor's again.
const SETTLE_MS = 150

export const bindHeaderScroll = () => {
  const header = document.querySelector('header')
  if (!header) return

  header.dataset.state = 'visible'

  let lastY = window.scrollY
  let guided = false
  let settle: ReturnType<typeof setTimeout> | undefined

  const settleLater = () => {
    clearTimeout(settle)
    settle = setTimeout(() => {
      guided = false
    }, SETTLE_MS)
  }

  const onAnchorScroll = () => {
    header.dataset.state = 'visible'
    guided = true
    settleLater()
  }

  const onScroll = () => {
    const y = window.scrollY

    if (guided) {
      lastY = y
      settleLater()
      return
    }

    const delta = y - lastY

    if (y <= 0) {
      header.dataset.state = 'visible'
    } else if (delta > THRESHOLD) {
      header.dataset.state = 'hidden'
    } else if (-delta > THRESHOLD) {
      header.dataset.state = 'visible'
    }

    if (Math.abs(delta) > THRESHOLD) lastY = y
  }

  const onFocusIn = () => {
    header.dataset.state = 'visible'
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  header.addEventListener('focusin', onFocusIn)
  document.addEventListener(ANCHOR_SCROLL_EVENT, onAnchorScroll)

  return () => {
    clearTimeout(settle)
    window.removeEventListener('scroll', onScroll)
    header.removeEventListener('focusin', onFocusIn)
    document.removeEventListener(ANCHOR_SCROLL_EVENT, onAnchorScroll)
  }
}

onVisit(bindHeaderScroll)
