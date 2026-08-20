import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/helpers/classnames'

export const eyebrowVariants = cva(
  'inline-flex w-fit rounded-full border-2 px-3 py-1 font-semibold text-xs uppercase tracking-widest',
  {
    variants: {
      variant: {
        default: 'border-action/30 text-action',
        muted: 'border-border text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type EyebrowProps = HTMLArkProps<'span'> &
  VariantProps<typeof eyebrowVariants>

export function Eyebrow({ variant, className, ...props }: EyebrowProps) {
  return (
    <ark.span
      className={cn(eyebrowVariants({ variant }), className)}
      {...props}
    />
  )
}
