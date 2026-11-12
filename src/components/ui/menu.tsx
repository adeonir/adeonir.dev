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
        'border-border bg-popover text-popover-foreground light:shadow-black/25 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in z-60 rounded-lg border p-4 shadow-xl shadow-black/50 focus-visible:outline-none',
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
        'data-highlighted:text-primary data-highlighted:ring-ring data-highlighted:ring-offset-background focus-visible:outline-none data-highlighted:ring-2 data-highlighted:ring-offset-2',
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
