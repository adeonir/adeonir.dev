import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Swap } from '~/components/ui/swap'
import IconMoon from '~icons/tabler/moon'
import IconSun from '~icons/tabler/sun'

type ThemeToggleProps = {
  label: { dark: string; light: string }
}

export function ThemeToggle({ label }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const current = document.documentElement.dataset.theme
    setTheme(current === 'light' ? 'light' : 'dark')
  }, [])

  const handleToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {}
    setTheme(next)
  }

  const isLight = theme === 'light'

  return (
    <Button
      type="button"
      size="icon"
      aria-label={isLight ? label.light : label.dark}
      className="border-border!"
      aria-pressed={isLight}
      onClick={handleToggle}
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
