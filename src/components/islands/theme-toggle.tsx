import { ClientOnly } from '@ark-ui/react/client-only'
import { Portal } from '@ark-ui/react/portal'
import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Swap } from '~/components/ui/swap'
import { Tooltip } from '~/components/ui/tooltip'
import { $theme, toggleTheme } from '~/stores/theme'
import IconMoon from '~icons/tabler/moon'
import IconSun from '~icons/tabler/sun'

type ThemeToggleProps = {
  labels: { label: string; switchToLight: string; switchToDark: string }
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const theme = useStore($theme)
  const isLight = theme === 'light'
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    setPressed(isLight)
  }, [isLight])

  return (
    <Tooltip.Root
      lazyMount
      unmountOnExit
      positioning={{ placement: 'bottom', gutter: 8 }}
    >
      <Tooltip.Trigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={labels.label}
          aria-pressed={pressed}
          onClick={toggleTheme}
          suppressHydrationWarning
        >
          <ClientOnly
            fallback={
              <>
                <IconMoon className="in-data-[theme=light]:hidden size-4.5" />
                <IconSun className="in-data-[theme=dark]:hidden size-4.5" />
              </>
            }
          >
            <Swap.Root className="size-4.5" swap={isLight}>
              <Swap.Indicator type="off" variant="rotate">
                <IconMoon className="size-4.5" />
              </Swap.Indicator>
              <Swap.Indicator type="on" variant="rotate">
                <IconSun className="size-4.5" />
              </Swap.Indicator>
            </Swap.Root>
          </ClientOnly>
        </Button>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>
            {isLight ? labels.switchToDark : labels.switchToLight}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  )
}
