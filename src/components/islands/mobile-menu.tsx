import { animate } from 'motion/mini'
import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Swap } from '~/components/ui/swap'
import IconMenu from '~icons/tabler/menu-2'
import IconX from '~icons/tabler/x'

type MobileMenuProps = {
  content: { trigger: { open: string; close: string } }
}

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
        { opacity: [0, 1], y: [8, 0] },
        { duration: 0.4, delay: 0.2 + index * 0.07, ease: ENTER_EASE },
      )
    }
  })
}

export function MobileMenu({ content }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement | null>(null)
  const mounted = useRef(false)

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
    document.addEventListener('astro:before-swap', close)
    return () => document.removeEventListener('astro:before-swap', close)
  }, [])

  useEffect(() => {
    if (!open) return
    document.documentElement.dataset.menu = 'open'
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
      for (const node of covered) node.inert = false
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', onClick)
    }
  }, [open])

  return (
    <Button
      aria-label={open ? content.trigger.close : content.trigger.open}
      aria-expanded={open}
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
