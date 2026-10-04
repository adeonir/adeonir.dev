import { Tooltip as ArkTooltip } from '@ark-ui/react/tooltip'
import type { ComponentProps } from 'react'

import { cn } from '~/helpers/classnames'

function Positioner({
  className,
  ...props
}: ComponentProps<typeof ArkTooltip.Positioner>) {
  return <ArkTooltip.Positioner className={cn(className)} {...props} />
}

function Content({
  className,
  ...props
}: ComponentProps<typeof ArkTooltip.Content>) {
  return (
    <ArkTooltip.Content
      className={cn(
        'z-60 rounded-md border border-border bg-popover px-2 py-1 font-mono text-popover-foreground text-sm light:shadow-black/25 shadow-black/50 shadow-md data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
        className,
      )}
      {...props}
    />
  )
}

export const Tooltip = {
  Root: ArkTooltip.Root,
  Trigger: ArkTooltip.Trigger,
  Positioner,
  Content,
}
