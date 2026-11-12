import { ark, type HTMLArkProps } from '@ark-ui/react/factory'

import { cn } from '~/helpers/classnames'

export type NavLinkProps = HTMLArkProps<'a'>

export function NavLink({ className, ...props }: NavLinkProps) {
  return (
    <ark.a
      className={cn(
        'text-muted-foreground hover:text-primary focus-visible:ring-ring focus-visible:ring-offset-background relative -mx-1 -my-px rounded-sm px-1 py-px font-mono text-sm font-semibold transition after:absolute after:inset-x-0 after:-inset-y-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  )
}
