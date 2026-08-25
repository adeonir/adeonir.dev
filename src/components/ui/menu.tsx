import { Menu as ArkMenu } from '@ark-ui/react/menu'
import type { ComponentProps } from 'react'

import { cn } from '~/helpers/classnames'

function Content({
  className,
  ...props
}: ComponentProps<typeof ArkMenu.Content>) {
  return (
    <ArkMenu.Content
      className={cn(
        'z-60 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-foreground/5 shadow-lg focus-visible:outline-none data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
        className,
      )}
      {...props}
    />
  )
}

function Item({ className, ...props }: ComponentProps<typeof ArkMenu.Item>) {
  return (
    <ArkMenu.Item
      className={cn(
        'focus-visible:outline-none data-[highlighted]:text-primary data-[highlighted]:ring-4 data-[highlighted]:ring-ring/50 data-[highlighted]:ring-offset-2 data-[highlighted]:ring-offset-background',
        className,
      )}
      {...props}
    />
  )
}

export const Menu = {
  Root: ArkMenu.Root,
  Trigger: ArkMenu.Trigger,
  Positioner: ArkMenu.Positioner,
  Content,
  Item,
}
