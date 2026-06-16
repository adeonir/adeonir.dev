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
        flip: 'data-[state=closed]:animate-flip-out data-[state=open]:animate-flip-in',
        rotate:
          'data-[state=closed]:animate-rotate-out data-[state=open]:animate-rotate-in',
        scale:
          'data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in',
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
