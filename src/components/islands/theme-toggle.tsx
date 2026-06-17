import { useStore } from '@nanostores/react'
import { useEffect } from 'react'

import { Button } from '~/components/ui/button'
import { Swap } from '~/components/ui/swap'
import { $theme, syncTheme, toggleTheme } from '~/stores/theme'
import IconMoon from '~icons/tabler/moon'
import IconSun from '~icons/tabler/sun'

type ThemeToggleProps = {
  labels: { dark: string; light: string }
}

export function ThemeToggle({ labels: label }: ThemeToggleProps) {
  const theme = useStore($theme)

  useEffect(() => {
    syncTheme()
  }, [])

  const isLight = theme === 'light'

  return (
    <Button
      type="button"
      size="icon"
      aria-label={isLight ? label.light : label.dark}
      className="border-border!"
      aria-pressed={isLight}
      onClick={toggleTheme}
    >
      <Swap.Root className="size-5" swap={isLight}>
        <Swap.Indicator type="off" variant="rotate">
          <IconMoon className="size-5" />
        </Swap.Indicator>
        <Swap.Indicator type="on" variant="rotate">
          <IconSun className="size-5" />
        </Swap.Indicator>
      </Swap.Root>
    </Button>
  )
}
