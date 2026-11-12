import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'focus-visible:ring-ring focus-visible:ring-offset-background inline-flex cursor-pointer items-center justify-center rounded-lg transition-[color,background-color,border-color,box-shadow,opacity,text-decoration-color] hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/95 light:hover:shadow-black/25 hover:shadow-black/75',
        outline:
          'border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/10 hover:text-primary light:hover:shadow-black/10 focus:border-primary/50 border bg-transparent hover:shadow-black/25',
        ghost:
          'text-muted-foreground hover:bg-muted/10 hover:text-primary light:hover:shadow-black/10 bg-transparent hover:shadow-black/25',
        link: 'text-primary decoration-primary/40 hover:decoration-primary underline underline-offset-4 hover:shadow-none',
      },
      size: {
        default: 'text-button h-11 gap-2 px-5',
        inline: 'h-auto p-0',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
