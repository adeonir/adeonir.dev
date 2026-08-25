import { Portal } from '@ark-ui/react/portal'

import { Button } from '~/components/ui/button'
import { Menu } from '~/components/ui/menu'
import { NavLink } from '~/components/ui/nav-link'
import { Popover } from '~/components/ui/popover'

const items = ['First item', 'Second item', 'Third item']

export function FloatingDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Popover.Root
        autoFocus={false}
        positioning={{
          placement: 'top-start',
          gutter: 8,
          flip: false,
        }}
      >
        <Popover.Trigger asChild>
          <Button variant="outline">Popover</Button>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content className="max-w-64 text-sm">
              The quick brown fox jumps over the lazy dog.
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>

      <Menu.Root
        positioning={{
          placement: 'bottom-start',
          gutter: 8,
          flip: false,
        }}
      >
        <Menu.Trigger asChild>
          <Button variant="outline">Menu</Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content className="flex flex-col gap-4">
              {items.map((item) => (
                <Menu.Item key={item} value={item} asChild>
                  <NavLink href="#" tabIndex={-1}>
                    {item}
                  </NavLink>
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </div>
  )
}
