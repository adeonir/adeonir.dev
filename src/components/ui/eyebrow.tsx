import { ark, type HTMLArkProps } from '@ark-ui/react/factory'

import { cn } from '~/helpers/classnames'

export type EyebrowProps = HTMLArkProps<'span'>

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <ark.span
      className={cn(
        'inline-flex w-fit rounded-full border-2 border-primary px-3 py-1 font-semibold text-action text-xs uppercase tracking-widest',
        className,
      )}
      {...props}
    />
  )
}
