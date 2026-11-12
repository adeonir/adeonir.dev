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
        'border-border bg-popover text-popover-foreground light:shadow-black/25 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in z-60 rounded-md border px-2 py-1 font-mono text-sm shadow-md shadow-black/50',
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
