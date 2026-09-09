import { ark, type HTMLArkProps } from '@ark-ui/react/factory'

import { cn } from '~/helpers/classnames'

export type TagProps = HTMLArkProps<'span'>

export function Tag({ className, ...props }: TagProps) {
  return (
    <ark.span
      className={cn(
        'inline-flex w-fit rounded-full bg-muted px-3 py-1 font-mono text-muted-foreground text-sm',
        className,
      )}
      {...props}
    />
  )
}
