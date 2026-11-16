import { animate } from 'motion/mini'
import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Swap } from '~/components/ui/swap'
import { syncThemeColor } from '~/stores/theme'
import IconMenu from '~icons/tabler/menu-2'
import IconX from '~icons/tabler/x'

type MobileMenuProps = {
  content: { trigger: { open: string; close: string } }
}

const CLOSE_FALLBACK_MS = 400

const ENTER_EASE: [number, number, number, number] = [0.33, 1, 0.68, 1]

function animateLinks(open: boolean) {
  const links = document.querySelectorAll<HTMLElement>('[data-menu-link]')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  links.forEach((link, index) => {
    if (!open) {
      animate(link, { opacity: 0 }, { duration: 0.1, ease: 'easeIn' })
    } else if (reduced) {
      animate(link, { opacity: [0, 1] }, { duration: 0.15, ease: 'easeOut' })
    } else {
      animate(
        link,
        { opacity: [0, 1], transform: ['translateY(8px)', 'none'] },
        { duration: 0.4, delay: 0.25 + index * 0.07, ease: ENTER_EASE },
      )
    }
  })
}

export function MobileMenu({ content }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement | null>(null)
  const mounted = useRef(false)
  const isOpen = useRef(false)
  isOpen.current = open

  useEffect(() => {
    if (mounted.current) animateLinks(open)
    mounted.current = true
  }, [open])

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 48rem)')
    const close = (event: { matches: boolean }) => {
      if (event.matches) setOpen(false)
    }
    wide.addEventListener('change', close)
    return () => wide.removeEventListener('change', close)
  }, [])

  useEffect(() => {
    const close = () => setOpen(false)
    const holdLoader = (event: Event & { loader: () => Promise<void> }) => {
      if (!isOpen.current) return
      const surface = document.querySelector('[data-menu-surface]')
      // The surface background is the last transition of a close, in both
      // motion modes; the timer covers a close where nothing transitions
      // (300ms is the longest). Transitions inside the surface bubble here.
      const closed = new Promise<void>((resolve) => {
        const finish = (event?: Event) => {
          if (
            event &&
            (event.target !== surface ||
              (event as TransitionEvent).propertyName !== 'background-color')
          )
            return
          clearTimeout(timer)
          surface?.removeEventListener('transitionend', finish)
          resolve()
        }
        const timer = setTimeout(finish, CLOSE_FALLBACK_MS)
        surface?.addEventListener('transitionend', finish)
      })
      const load = event.loader
      event.loader = () => Promise.all([closed, load()]).then(() => undefined)
      setOpen(false)
    }
    document.addEventListener('astro:before-preparation', holdLoader)
    document.addEventListener('astro:before-swap', close)
    return () => {
      document.removeEventListener('astro:before-preparation', holdLoader)
      document.removeEventListener('astro:before-swap', close)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    document.documentElement.dataset.menu = 'open'
    syncThemeColor()
    const covered = document.querySelectorAll<HTMLElement>('main, footer')
    for (const node of covered) node.inert = true

    const closeAndRefocus = () => {
      setOpen(false)
      button.current?.focus()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAndRefocus()
    }
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const link = event.target.closest<HTMLAnchorElement>(
        '[data-menu-surface] nav a',
      )
      if (!link?.hash || link.hash === '#') return
      if (link.origin !== location.origin) return
      if (link.pathname !== location.pathname) return
      closeAndRefocus()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('click', onClick)

    return () => {
      delete document.documentElement.dataset.menu
      syncThemeColor()
      for (const node of covered) node.inert = false
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', onClick)
    }
  }, [open])

  return (
    <Button
      aria-label={open ? content.trigger.close : content.trigger.open}
      aria-expanded={open}
      aria-controls="menu-navigation"
      variant="ghost"
      size="icon"
      onClick={(event) => {
        button.current = event.currentTarget
        setOpen((value) => !value)
      }}
    >
      <Swap.Root className="size-4.5" swap={open}>
        <Swap.Indicator type="off" variant="rotate">
          <IconMenu className="size-4.5" />
        </Swap.Indicator>
        <Swap.Indicator type="on" variant="rotate">
          <IconX className="size-4.5" />
        </Swap.Indicator>
      </Swap.Root>
    </Button>
  )
}
