import { ark, type HTMLArkProps } from '@ark-ui/react/factory'

import { cn } from '~/helpers/classnames'

export type EyebrowProps = HTMLArkProps<'span'>

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <ark.span
      className={cn(
        'border-border text-muted-foreground inline-flex w-fit rounded-full border-2 px-3 py-1 text-xs font-semibold tracking-widest uppercase',
        className,
      )}
      {...props}
    />
  )
}
