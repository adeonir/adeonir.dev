import { Toast as ArkToast } from '@ark-ui/react/toast'
import type { ComponentProps } from 'react'

import { cn } from '~/helpers/classnames'

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

export const Toast = {
  Root,
  Title,
  Description,
}
