import { onVisit } from '~/scripts/visit'

export const bindFeaturedTitle = () => {
  const title = document.querySelector<HTMLElement>('[data-featured-title]')
  const section = title?.closest<HTMLElement>('section')
  if (!title || !section) return

  const stack = section.querySelector<HTMLElement>('[data-stack-card]')

  const observer = new ResizeObserver(() => {
    section.style.setProperty('--featured-title-h', `${title.offsetHeight}px`)
    if (stack) {
      section.style.setProperty('--featured-stack-h', `${stack.offsetHeight}px`)
    }
  })
  observer.observe(title)
  if (stack) observer.observe(stack)

  return () => observer.disconnect()
}

onVisit(bindFeaturedTitle)
