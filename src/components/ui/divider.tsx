import { ark, type HTMLArkProps } from '@ark-ui/react/factory'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/helpers/classnames'

const dividerVariants = cva('shrink-0 border-border', {
  variants: {
    orientation: {
      horizontal: 'w-full border-t',
      vertical: 'border-l',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export type DividerProps = HTMLArkProps<'hr'> &
  VariantProps<typeof dividerVariants>

export function Divider({ className, orientation, ...props }: DividerProps) {
  return (
    <ark.hr
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={cn(dividerVariants({ orientation }), className)}
      {...props}
    />
  )
}
