import { onVisit } from '~/scripts/visit'

// Trackpads and touch report a few pixels of movement in both directions
// while the finger is still; anything under this is ignored.
const THRESHOLD = 8

export const bindHeaderScroll = () => {
  const header = document.querySelector('header')
  if (!header) return

  header.dataset.state = 'visible'

  let lastY = window.scrollY

  const onScroll = () => {
    const y = window.scrollY
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

  return () => {
    window.removeEventListener('scroll', onScroll)
    header.removeEventListener('focusin', onFocusIn)
  }
}

onVisit(bindHeaderScroll)
