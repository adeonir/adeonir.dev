import { ark, type HTMLArkProps } from '@ark-ui/react/factory'

import { cn } from '~/lib/cn'

export type DividerProps = HTMLArkProps<'hr'>

export function Divider({ className, ...props }: DividerProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6">
      <ark.hr className={cn('border-border border-t', className)} {...props} />
    </div>
  )
}
