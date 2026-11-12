import { Popover as ArkPopover } from '@ark-ui/react/popover'
import type { ComponentProps } from 'react'

import { cn } from '~/helpers/classnames'

function Positioner({
  className,
  ...props
}: ComponentProps<typeof ArkPopover.Positioner>) {
  return <ArkPopover.Positioner className={cn(className)} {...props} />
}

function Content({
  className,
  ...props
}: ComponentProps<typeof ArkPopover.Content>) {
  return (
    <ArkPopover.Content
      className={cn(
        'border-border bg-popover text-popover-foreground light:shadow-black/25 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in z-60 rounded-lg border px-4 py-2 shadow-lg shadow-black/50',
        className,
      )}
      {...props}
    />
  )
}

export const Popover = {
  Root: ArkPopover.Root,
  Trigger: ArkPopover.Trigger,
  Context: ArkPopover.Context,
  CloseTrigger: ArkPopover.CloseTrigger,
  Positioner,
  Content,
}
