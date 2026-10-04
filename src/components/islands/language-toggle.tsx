import { buttonVariants } from '~/components/ui/button-variants'
import { cn } from '~/helpers/classnames'

type LanguageToggleProps = {
  href: string
  code: string
  name: string
}

export function LanguageToggle({ href, code, name }: LanguageToggleProps) {
  return (
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
  )
}
