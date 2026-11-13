import { scroll } from 'motion'

import { onVisit } from '~/scripts/visit'

// Share of its size a card gives up for each card stacked in front of it.
const STEP = 0.05

// How far a front card has slid over a back card: 0 when the front card's top
// reaches the back card's bottom edge, 1 once the front card pins in place.
// Read from the rendered boxes, because scroll()'s own target tracking
// measures layout position and misreads a sticky card.
const overlap = (back: HTMLElement, front: HTMLElement) => {
  const surface = back.firstElementChild as HTMLElement
  const bottom = back.getBoundingClientRect().top + surface.offsetHeight
  // Where the front card pins, measured from the back card's current top, so
  // the share holds once the whole pinned stack scrolls away together.
  const offset =
    Number.parseFloat(getComputedStyle(front).top) -
    Number.parseFloat(getComputedStyle(back).top)
  const pinned = back.getBoundingClientRect().top + offset
  const top = front.getBoundingClientRect().top
  const share = (bottom - top) / (bottom - pinned)
  return Math.min(Math.max(share, 0), 1)
}

export const bindRecede = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const cards = [...document.querySelectorAll<HTMLElement>('[data-stack-card]')]
  if (cards.length < 2) return

  const behind = cards.slice(0, -1)

  const stop = scroll(() => {
    behind.forEach((card, index) => {
      const covered = cards
        .slice(index + 1)
        .reduce((sum, front) => sum + overlap(card, front), 0)
      card.style.transform = `scale(${1 - STEP * covered})`
    })
  })

  return () => {
    stop()
    for (const card of behind) card.style.removeProperty('transform')
  }
}

onVisit(bindRecede)
