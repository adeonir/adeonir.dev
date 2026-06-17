import { Portal } from '@ark-ui/react/portal'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '~/components/islands/theme-toggle'
import { Button } from '~/components/ui/button'
import { Divider } from '~/components/ui/divider'
import { NavLink } from '~/components/ui/nav-link'
import { Popover } from '~/components/ui/popover'
import { Swap } from '~/components/ui/swap'
import IconMenu from '~icons/tabler/menu'
import IconX from '~icons/tabler/x'

type MobileMenuProps = {
  nav: { label: string; href: string }[]
  menu: { label: string; open: string; close: string }
  theme: { dark: string; light: string }
}

export function MobileMenu({ nav, menu, theme }: MobileMenuProps) {
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
        <Button
          aria-label={open ? menu.close : menu.open}
          className="border-border!"
          size="icon"
        >
          <Swap.Root className="size-5" swap={open}>
            <Swap.Indicator type="off" variant="fade">
              <IconMenu className="size-5" />
            </Swap.Indicator>
            <Swap.Indicator type="on" variant="fade">
              <IconX className="size-5" />
            </Swap.Indicator>
          </Swap.Root>
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            aria-label={menu.label}
            className="flex flex-col gap-4"
          >
            <nav>
              <ul className="flex flex-col gap-3">
                {nav.map((item) => (
                  <li key={item.href} className="px-1 py-px">
                    <Popover.CloseTrigger asChild>
                      <NavLink href={item.href}>{item.label}</NavLink>
                    </Popover.CloseTrigger>
                  </li>
                ))}
              </ul>
            </nav>
            <Divider className="block xxs:hidden" />
            <div className="flex xxs:hidden items-center gap-4">
              <ThemeToggle label={theme} />
            </div>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
