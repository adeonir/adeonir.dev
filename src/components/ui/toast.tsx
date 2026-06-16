import { Toast as ArkToast } from '@ark-ui/react/toast'
import type { ComponentProps } from 'react'

import { cn } from '~/helpers/classnames'
import IconX from '~icons/tabler/x'

function Root({ className, ...props }: ComponentProps<typeof ArkToast.Root>) {
  return (
    <ArkToast.Root
      className={cn(
        'flex min-w-80 flex-col gap-1 rounded-lg border p-4 shadow-lg',
        'data-[type=success]:border-success data-[type=success]:bg-success data-[type=success]:text-success-foreground',
        'data-[type=error]:border-error data-[type=error]:bg-error data-[type=error]:text-error-foreground',
        'data-[type=warning]:border-warning data-[type=warning]:bg-warning data-[type=warning]:text-warning-foreground',
        'data-[type=info]:border-info data-[type=info]:bg-info data-[type=info]:text-info-foreground',
        'motion-safe:data-[state=closed]:animate-fade-out motion-safe:data-[state=open]:animate-fade-in',
        className,
      )}
      {...props}
    />
  )
}

function Title({ className, ...props }: ComponentProps<typeof ArkToast.Title>) {
  return (
    <ArkToast.Title
      className={cn('text-current text-subtitle', className)}
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
      className={cn('text-body text-current/80', className)}
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
        'absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-md text-current opacity-80 transition-opacity hover:bg-current/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
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
  Title,
  Description,
  CloseTrigger,
}
