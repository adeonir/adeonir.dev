import { onVisit } from '~/scripts/visit'

// iOS Safari applies :active only when a touch listener is attached to the
// element or an ancestor, so the menu links need this empty one.
export const bindMenuPress = () => {
  const surface = document.querySelector<HTMLElement>('[data-menu-surface]')
  if (!surface) return

  const onTouchStart = () => {}
  surface.addEventListener('touchstart', onTouchStart, { passive: true })

  return () => surface.removeEventListener('touchstart', onTouchStart)
}

onVisit(bindMenuPress)
