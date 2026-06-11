import { ark, type HTMLArkProps } from '@ark-ui/react/factory'

import { cn } from '~/lib/cn'

export type EyebrowProps = HTMLArkProps<'span'>

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <ark.span
      className={cn(
        'inline-flex w-fit rounded-full border-2 border-primary px-3 py-1 text-action text-label',
        className,
      )}
      {...props}
    />
  )
}
