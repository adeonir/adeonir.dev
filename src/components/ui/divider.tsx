import { ark, type HTMLArkProps } from '@ark-ui/react/factory'

import { cn } from '~/helpers/classnames'

export type DividerProps = HTMLArkProps<'hr'>

export function Divider({ className, ...props }: DividerProps) {
  return (
    <div className="w-full">
      <ark.hr className={cn('border-border border-t', className)} {...props} />
    </div>
  )
}
