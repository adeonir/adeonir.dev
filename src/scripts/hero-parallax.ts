import { onVisit } from '~/scripts/visit'

// Share of the remaining distance each frame closes.
const EASE = 0.05
// Below this distance the position snaps to the target and the loop stops.
const SETTLED = 0.001

export const bindParallax = () => {
  if (window.matchMedia('(pointer: coarse)').matches) return

  const hero = document.querySelector<HTMLElement>('#hero')
  if (!hero) return

  const target = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }
  let frame: number | undefined

  const step = () => {
    current.x += (target.x - current.x) * EASE
    current.y += (target.y - current.y) * EASE

    const settled =
      Math.abs(target.x - current.x) < SETTLED &&
      Math.abs(target.y - current.y) < SETTLED
    if (settled) {
      current.x = target.x
      current.y = target.y
    }

    hero.style.setProperty('--px', String(current.x))
    hero.style.setProperty('--py', String(current.y))
    frame = settled ? undefined : requestAnimationFrame(step)
  }

  // The hero's edge is 1 and its center is 0, so the pointer's position is
  // independent of the hero's size.
  const onMove = (event: PointerEvent) => {
    const rect = hero.getBoundingClientRect()
    const clamp = (value: number) => Math.min(Math.max(value, -1), 1)
    target.x = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1)
    target.y = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1)
    if (frame === undefined) frame = requestAnimationFrame(step)
  }

  hero.addEventListener('pointermove', onMove)

  return () => {
    hero.removeEventListener('pointermove', onMove)
    if (frame !== undefined) cancelAnimationFrame(frame)
    frame = undefined
  }
}

onVisit(bindParallax)
