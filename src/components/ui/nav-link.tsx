import { ark, type HTMLArkProps } from '@ark-ui/react/factory'

import { cn } from '~/lib/cn'

export type NavLinkProps = HTMLArkProps<'a'>

export default function NavLink({ className, ...props }: NavLinkProps) {
  return (
    <ark.a
      className={cn(
        "-mx-1 -my-px rounded-sm px-1 py-px font-semibold text-code text-muted-foreground transition-colors before:mr-2 before:text-secondary before:content-['#'] hover:text-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    />
  )
}
