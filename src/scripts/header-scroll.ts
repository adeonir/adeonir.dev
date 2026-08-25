import { onVisit } from '~/scripts/visit'

export const bindHeaderScroll = () => {
  const header = document.querySelector('header')
  if (!header) return

  const sentinel = document.createElement('div')
  sentinel.setAttribute('aria-hidden', 'true')
  sentinel.style.cssText = 'position:absolute;top:0;width:1px;height:8px'
  document.body.insertBefore(sentinel, document.body.firstChild)

  let opened = false

  const observer = new IntersectionObserver(([entry]) => {
    header.dataset.state = entry.isIntersecting ? 'top' : 'scrolled'

    if (!opened) {
      opened = true
      requestAnimationFrame(() => {
        header.dataset.transition = 'open'
      })
    }
  })

  observer.observe(sentinel)

  return () => {
    observer.disconnect()
    sentinel.remove()
  }
}

onVisit(bindHeaderScroll)
