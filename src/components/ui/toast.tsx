import { Toast as ArkToast } from '@ark-ui/react/toast'
import type { ComponentProps } from 'react'

import { cn } from '~/helpers/classnames'
import IconAlertCircle from '~icons/tabler/alert-circle'
import IconAlertTriangle from '~icons/tabler/alert-triangle'
import IconCircleCheck from '~icons/tabler/circle-check'
import IconInfoCircle from '~icons/tabler/info-circle'
import IconX from '~icons/tabler/x'

const indicators = {
  success: {
    icon: IconCircleCheck,
    badge: 'bg-success ring-success/30',
    glyph: 'text-success-foreground',
  },
  error: {
    icon: IconAlertCircle,
    badge: 'bg-error ring-error/30',
    glyph: 'text-error-foreground',
  },
  warning: {
    icon: IconAlertTriangle,
    badge: 'bg-warning ring-warning/30',
    glyph: 'text-warning-foreground',
  },
  info: {
    icon: IconInfoCircle,
    badge: 'bg-info ring-info/30',
    glyph: 'text-info-foreground',
  },
} as const

type ToastType = keyof typeof indicators

function Root({ className, ...props }: ComponentProps<typeof ArkToast.Root>) {
  return (
    <ArkToast.Root
      className={cn(
        'flex min-w-84 items-center gap-6 rounded-lg border-2 border-border bg-popover p-4 pl-6 text-foreground shadow-lg',
        'z-(--z-index) h-(--height) translate-x-(--x) translate-y-(--y) scale-(--scale) opacity-(--opacity)',
        'transition-[translate,scale,opacity,height,box-shadow] duration-400 ease-out will-change-[translate,opacity,scale]',
        className,
      )}
      {...props}
    />
  )
}

function Indicator({ type, className }: { type?: string; className?: string }) {
  const indicator = indicators[type as ToastType]
  if (!indicator) return null

  const { icon: Icon, badge, glyph } = indicator
  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full ring-6',
        badge,
        className,
      )}
    >
      <Icon className={cn('size-5', glyph)} />
    </span>
  )
}

function Title({ className, ...props }: ComponentProps<typeof ArkToast.Title>) {
  return (
    <ArkToast.Title
      className={cn('text-foreground text-subtitle', className)}
      {...props}
    />
  )
}

function Description({
  className,
  ...props
}: ComponentProps<typeof ArkToast.Description>) {
  return (
    <ArkToast.Description
      className={cn('text-body text-muted-foreground', className)}
      {...props}
    />
  )
}

function CloseTrigger({
  className,
  ...props
}: ComponentProps<typeof ArkToast.CloseTrigger>) {
  return (
    <ArkToast.CloseTrigger
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
      {...props}
    >
      <IconX className="size-4" />
    </ArkToast.CloseTrigger>
  )
}

export const Toast = {
  Root,
  Indicator,
  Title,
  Description,
  CloseTrigger,
}
