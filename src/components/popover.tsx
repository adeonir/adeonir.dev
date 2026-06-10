import { Popover as ArkPopover } from '@ark-ui/react/popover'
import type { ComponentProps } from 'react'

import { cn } from '~/lib/cn'

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
        'z-60 rounded-lg border border-border bg-popover p-4 text-popover-foreground motion-safe:data-[state=closed]:animate-fade-out motion-safe:data-[state=open]:animate-fade-in',
        className,
      )}
      {...props}
    />
  )
}

const Popover = {
  Root: ArkPopover.Root,
  Trigger: ArkPopover.Trigger,
  Context: ArkPopover.Context,
  CloseTrigger: ArkPopover.CloseTrigger,
  Positioner,
  Content,
}

export default Popover
