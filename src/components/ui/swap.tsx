import { Swap as ArkSwap } from '@ark-ui/react/swap'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '~/helpers/classnames'

const indicatorVariants = cva(
  'absolute inset-0 flex items-center justify-center',
  {
    variants: {
      variant: {
        fade: 'data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
        flip: 'motion-safe:data-[state=closed]:animate-flip-out motion-safe:data-[state=open]:animate-flip-in motion-reduce:data-[state=closed]:animate-fade-out motion-reduce:data-[state=open]:animate-fade-in',
        rotate:
          'motion-safe:data-[state=closed]:animate-rotate-out motion-safe:data-[state=open]:animate-rotate-in motion-reduce:data-[state=closed]:animate-fade-out motion-reduce:data-[state=open]:animate-fade-in',
        scale:
          'motion-safe:data-[state=closed]:animate-scale-out motion-safe:data-[state=open]:animate-scale-in motion-reduce:data-[state=closed]:animate-fade-out motion-reduce:data-[state=open]:animate-fade-in',
      },
    },
    defaultVariants: {
      variant: 'fade',
    },
  },
)

function Root({ className, ...props }: ComponentProps<typeof ArkSwap.Root>) {
  return (
    <ArkSwap.Root
      className={cn('relative inline-flex', className)}
      {...props}
    />
  )
}

function Indicator({
  variant,
  className,
  ...props
}: ComponentProps<typeof ArkSwap.Indicator> &
  VariantProps<typeof indicatorVariants>) {
  return (
    <ArkSwap.Indicator
      className={cn(indicatorVariants({ variant }), className)}
      {...props}
    />
  )
}

export const Swap = {
  Root,
  Indicator,
}
