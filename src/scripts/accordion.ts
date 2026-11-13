import { animate } from 'motion/mini'

import { onVisit } from '~/scripts/visit'

// Same beat and curve as the entrance in motion.ts, so the panels move like
// the rest of the page.
const DURATION = 0.4
const EASE: [number, number, number, number] = [0.33, 1, 0.68, 1]

type Controls = ReturnType<typeof animate>

const settle = (panel: HTMLElement) => {
  panel.style.removeProperty('height')
  panel.style.removeProperty('opacity')
}

export const bindAccordion = () => {
  const groups = document.querySelectorAll<HTMLElement>('[data-accordion]')
  if (groups.length === 0) return

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const playing = new Map<HTMLElement, Controls>()
  const unbinds: (() => void)[] = []

  // Resolves true once the panel lands, unless a newer animation took over.
  const run = (panel: HTMLElement, from: number, to: number) => {
    playing.get(panel)?.stop()
    const controls = animate(
      panel,
      {
        height: [`${from}px`, `${to}px`],
        opacity: [from === 0 ? 0 : 1, to === 0 ? 0 : 1],
      },
      { duration: DURATION, ease: EASE },
    )
    playing.set(panel, controls)
    return controls.finished.then(() => {
      if (playing.get(panel) !== controls) return false
      playing.delete(panel)
      return true
    })
  }

  for (const group of groups) {
    const items = [
      ...group.querySelectorAll<HTMLDetailsElement>('[data-accordion-item]'),
    ]
    const panelOf = (item: HTMLDetailsElement) =>
      item.querySelector<HTMLElement>('[data-accordion-panel]')

    let current = items.find((item) => item.open)

    const expand = (item: HTMLDetailsElement) => {
      const panel = panelOf(item)
      const from = item.open && panel ? panel.offsetHeight : 0
      item.open = true
      if (!panel || still) return
      playing.get(panel)?.stop()
      settle(panel)
      run(panel, from, panel.offsetHeight).then((landed) => {
        if (landed) settle(panel)
      })
    }

    const collapse = (item: HTMLDetailsElement) => {
      const panel = panelOf(item)
      if (!panel || still) {
        item.open = false
        return
      }
      run(panel, panel.offsetHeight, 0).then((landed) => {
        if (!landed) return
        item.open = false
        settle(panel)
      })
    }

    // `name` would close the previous item before it could animate, so this
    // script owns exclusivity and keeps one item open at all times.
    for (const item of items) {
      item.removeAttribute('name')

      const summary = item.querySelector('summary')
      const onClick = (event: Event) => {
        event.preventDefault()
        if (item === current) return
        if (current) collapse(current)
        current = item
        expand(item)
      }
      // Find-in-page opens a closed item without a click.
      const onToggle = () => {
        if (!item.open || item === current) return
        if (current) current.open = false
        current = item
      }

      summary?.addEventListener('click', onClick)
      item.addEventListener('toggle', onToggle)
      unbinds.push(() => {
        summary?.removeEventListener('click', onClick)
        item.removeEventListener('toggle', onToggle)
      })
    }
  }

  return () => {
    for (const unbind of unbinds) unbind()
    for (const controls of playing.values()) controls.stop()
    playing.clear()
  }
}

onVisit(bindAccordion)
