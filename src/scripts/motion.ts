import { inView } from 'motion'
import { animate } from 'motion/mini'

import { onVisit } from '~/scripts/visit'

const BLOCK_RISE = 16
const ROW_RISE = 8

const DURATION = 0.4
const STEP = 0.07
const EASE: [number, number, number, number] = [0.33, 1, 0.68, 1]
const MARGIN = '0px 0px -25% 0px'

type Step = { element: HTMLElement; rise: number; delay: number }

const stepAt = (index: number) => Math.round(index * STEP * 1000) / 1000

const planSection = (section: HTMLElement) => {
  const steps: Step[] = []
  const blocks = section.querySelectorAll<HTMLElement>('[data-enter="block"]')

  blocks.forEach((block, blockIndex) => {
    steps.push({ element: block, rise: BLOCK_RISE, delay: stepAt(blockIndex) })

    const rows = block.querySelectorAll<HTMLElement>('[data-enter="row"]')

    rows.forEach((row, rowIndex) => {
      steps.push({
        element: row,
        rise: ROW_RISE,
        delay: stepAt(blockIndex + rowIndex + 1),
      })
    })
  })

  return steps
}

const hold = ({ element, rise }: Step) => {
  element.style.opacity = '0'
  element.style.transform = `translateY(${rise}px)`
}

const clear = ({ element }: Step) => {
  element.style.removeProperty('opacity')
  element.style.removeProperty('transform')
}

export const bindEnter = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const sections = document.querySelectorAll<HTMLElement>('main > section[id]')
  if (sections.length === 0) return

  const stops: (() => void)[] = []
  const playing: { stop: () => void }[] = []
  const held: Step[] = []

  for (const section of sections) {
    const steps = planSection(section)
    if (steps.length === 0) continue

    for (const step of steps) {
      hold(step)
      held.push(step)
    }

    let settled = false

    stops.push(
      inView(
        section,
        () => {
          if (settled) return
          settled = true

          for (const { element, delay } of steps) {
            playing.push(
              animate(
                element,
                { opacity: 1, transform: 'translateY(0px)' },
                { duration: DURATION, ease: EASE, delay },
              ),
            )
          }
        },
        { margin: MARGIN },
      ),
    )
  }

  if (held.length === 0) return

  return () => {
    for (const stop of stops) stop()
    for (const animation of playing) animation.stop()
    for (const step of held) clear(step)
  }
}

onVisit(bindEnter)
