import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center rounded-lg transition-[color,background-color,border-color,box-shadow,opacity] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/95 hover:shadow-black/75 light:hover:shadow-black/25',
        outline:
          'border border-border bg-transparent text-muted-foreground hover:border-primary/30 hover:bg-muted/10 hover:text-primary hover:shadow-black/25 light:hover:shadow-black/10 focus:border-primary/50',
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
