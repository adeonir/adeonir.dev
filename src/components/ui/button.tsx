import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/helpers/classnames'

export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center rounded-lg transition-[color,background-color,border-color,box-shadow,opacity] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-action text-action-foreground hover:bg-action/90 hover:shadow-action/12 hover:shadow-lg',
        outline:
          'border border-border bg-transparent text-muted-foreground hover:border-primary/30 hover:bg-muted/20 hover:text-primary hover:shadow-lg hover:shadow-primary/8 focus:border-primary',
      },
      size: {
        default: 'h-11 gap-2 px-5 text-button',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
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
