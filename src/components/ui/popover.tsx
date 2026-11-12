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
        'border-border bg-popover text-popover-foreground light:shadow-black/25 data-[state=closed]:animate-fade-out data-[state=open]:animate-blur-in z-60 origin-[var(--transform-origin)] rounded-lg border px-4 py-2 shadow-lg shadow-black/50 [--blur-in:0px] motion-safe:[--scale-in:0.96]',
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
