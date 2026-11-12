import { ark, type HTMLArkProps } from '@ark-ui/react/factory'

import { cn } from '~/helpers/classnames'
import IconArrowLeft from '~icons/tabler/arrow-left'
import IconArrowUpRight from '~icons/tabler/arrow-up-right'
import IconExternalLink from '~icons/tabler/external-link'

type Props = HTMLArkProps<'a'> & {
  icon?: 'arrow-left' | 'arrow-up-right'
  size?: 'small' | 'large'
}

export function Link({
  children,
  className,
  href,
  icon,
  rel,
  size = 'large',
  target,
  ...props
}: Props) {
  const isExternal = typeof href === 'string' && /^https?:\/\//.test(href)
  const classNames = cn(
    'group text-primary decoration-primary/40 hover:decoration-primary focus-visible:ring-ring focus-visible:ring-offset-background cursor-pointer font-medium underline underline-offset-4 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
    size === 'small' ? 'text-base' : 'text-body',
    className,
  )
  const iconSize = size === 'small' ? 'size-4' : 'size-5'

  return (
    <ark.a
      className={classNames}
      href={href}
      rel={isExternal ? 'noopener noreferrer' : rel}
      target={isExternal ? '_blank' : target}
      {...props}
    >
      {!isExternal && icon === 'arrow-left' && (
        <IconArrowLeft
          className={cn(
            'mr-2 inline-block transition-transform duration-200 motion-safe:group-hover:-translate-x-1',
            iconSize,
          )}
        />
      )}
      {children}
      {isExternal ? (
        <IconExternalLink
          className={cn(
            'ml-1 inline-block transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5',
            iconSize,
          )}
        />
      ) : (
        icon === 'arrow-up-right' && (
          <IconArrowUpRight
            className={cn(
              'ml-1 inline-block transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5',
              iconSize,
            )}
          />
        )
      )}
    </ark.a>
  )
}
