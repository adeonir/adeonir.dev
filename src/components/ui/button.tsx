import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/helpers/classnames'
import IconLoader from '~icons/tabler/loader-2'

export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center rounded-lg transition-[color,background-color,border-color,box-shadow,opacity] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/12',
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
  VariantProps<typeof buttonVariants> & { loading?: boolean }

export function Button({
  variant,
  size,
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <ark.button
      className={cn(
        buttonVariants({ variant, size }),
        loading && 'relative',
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span className="opacity-0">{children}</span>
          <span
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <IconLoader className="size-4 animate-spin" />
          </span>
        </>
      ) : (
        children
      )}
    </ark.button>
  )
}
