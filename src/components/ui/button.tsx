import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '~/helpers/classnames'
import IconLoader from '~icons/tabler/loader-2'

import { buttonVariants } from './button-variants'

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
