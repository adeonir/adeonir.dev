import { Portal } from '@ark-ui/react/portal'
import { useEffect, useState } from 'react'
import { Popover } from '~/components/popover'
import { Button } from '~/components/ui/button'
import { NavLink } from '~/components/ui/nav-link'
import IconMenu from '~icons/tabler/menu'
import IconX from '~icons/tabler/x'

type MobileMenuProps = {
  nav: { label: string; href: string }[]
  menu: { label: string; open: string; close: string }
}

export function MobileMenu({ nav, menu }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 48rem)')
    const close = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }
    wide.addEventListener('change', close)
    return () => wide.removeEventListener('change', close)
  }, [])

  return (
    <Popover.Root
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      modal
      lazyMount
      unmountOnExit
      positioning={{ placement: 'bottom-end', gutter: 8 }}
    >
      <Popover.Trigger asChild>
        <Button aria-label={open ? menu.close : menu.open}>
          {open ? (
            <IconX className="size-4" />
          ) : (
            <IconMenu className="size-4" />
          )}
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content aria-label={menu.label} className="px-6">
            <nav>
              <ul className="flex flex-col gap-3">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Popover.CloseTrigger asChild>
                      <NavLink href={item.href}>{item.label}</NavLink>
                    </Popover.CloseTrigger>
                  </li>
                ))}
              </ul>
            </nav>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
