import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/lib/cn'

export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-transparent text-muted-foreground hover:border-primary/30 hover:bg-muted/20 hover:text-primary hover:shadow-lg hover:shadow-primary/8',
      },
      size: {
        default: 'h-11 gap-2 px-5 text-button',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  },
)

export type ButtonProps = HTMLArkProps<'button'> &
  VariantProps<typeof buttonVariants>

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <ark.button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
