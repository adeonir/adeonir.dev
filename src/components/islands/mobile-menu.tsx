import { Portal } from '@ark-ui/react/portal'
import { type ReactNode, useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Menu } from '~/components/ui/menu'
import { NavLink } from '~/components/ui/nav-link'
import { Swap } from '~/components/ui/swap'
import IconMenu from '~icons/tabler/menu-2'
import IconX from '~icons/tabler/x'

type MobileMenuProps = {
  nav: { label: string; href: string }[]
  content: { label: string; trigger: { open: string; close: string } }
  children: ReactNode
}

export function MobileMenu({ nav, content, children }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 48rem)')
    const close = (event: MediaQueryListEvent) => {
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
    return () => {
      delete document.documentElement.dataset.menu
    }
  }, [open])

  return (
    <Menu.Root
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      positioning={{ placement: 'bottom-end', gutter: 8 }}
      navigate={({ node }) => {
        // Zag's default navigate dispatches a non-bubbling click, which never
        // reaches the handler that closes the menu. Send the same click a
        // pointer would, so the keyboard and the mouse share one path.
        node.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true }),
        )
      }}
    >
      <Menu.Trigger asChild>
        <Button
          aria-label={open ? content.trigger.close : content.trigger.open}
          variant="ghost"
          size="icon"
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
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            aria-label={content.label}
            className="flex flex-col gap-4"
          >
            {nav.map((item) => (
              <Menu.Item key={item.href} value={item.href} asChild>
                <NavLink href={item.href} tabIndex={-1}>
                  {item.label}
                </NavLink>
              </Menu.Item>
            ))}
            {children}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
