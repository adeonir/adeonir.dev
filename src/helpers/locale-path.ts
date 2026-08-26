import type { Locale } from './content'

export const getLocalizedPath = (
  pathname: string,
  targetLocale: Locale,
): string => {
  if (targetLocale === 'en') {
    return pathname === '/' ? '/en/' : `/en${pathname}`
  }

  const portuguesePath = pathname.replace(/^\/en(?=\/|$)/, '')
  return portuguesePath || '/'
}
