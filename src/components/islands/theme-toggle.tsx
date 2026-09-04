import { ClientOnly } from '@ark-ui/react/client-only'
import { useStore } from '@nanostores/react'

import { Button } from '~/components/ui/button'
import { Swap } from '~/components/ui/swap'
import { $theme, toggleTheme } from '~/stores/theme'
import IconMoon from '~icons/tabler/moon'
import IconSun from '~icons/tabler/sun'

type ThemeToggleProps = {
  labels: { dark: string; light: string }
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const theme = useStore($theme)
  const isLight = theme === 'light'

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={isLight ? labels.light : labels.dark}
      aria-pressed={isLight}
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
  )
}
