import { Portal } from '@ark-ui/react/portal'

import { buttonVariants } from '~/components/ui/button-variants'
import { Tooltip } from '~/components/ui/tooltip'
import { cn } from '~/helpers/classnames'

type LanguageToggleProps = {
  href: string
  code: string
  name: string
}

export function LanguageToggle({ href, code, name }: LanguageToggleProps) {
  return (
    <Tooltip.Root
      lazyMount
      unmountOnExit
      positioning={{ placement: 'bottom', gutter: 8 }}
    >
      <Tooltip.Trigger asChild>
        <a
          href={href}
          data-language-link
          aria-label={name}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'font-mono',
          )}
        >
          {code}
        </a>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>{name}</Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  )
}
