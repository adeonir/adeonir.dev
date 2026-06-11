import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/lib/cn'

const button = cva(
  'inline-flex cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-transparent text-muted-foreground hover:bg-muted/20',
      },
      size: {
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'icon',
    },
  },
)

export type ButtonProps = HTMLArkProps<'button'> & VariantProps<typeof button>

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <ark.button
      className={cn(button({ variant, size }), className)}
      {...props}
    />
  )
}
