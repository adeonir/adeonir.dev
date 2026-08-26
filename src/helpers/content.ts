export const supportedLocales = ['pt', 'en'] as const

export type Locale = (typeof supportedLocales)[number]

export const contentCollections = [
  'settings',
  'header',
  'mobileMenu',
  'themeToggle',
  'footer',
  'hero',
  'about',
  'stack',
  'contact',
  'notFound',
  'emails',
  'console',
] as const

export type ContentCollection = (typeof contentCollections)[number]

const localizedCollectionNames = {
  pt: {
    settings: 'settings',
    header: 'header',
    mobileMenu: 'mobileMenu',
    themeToggle: 'themeToggle',
    footer: 'footer',
    hero: 'hero',
    about: 'about',
    stack: 'stack',
    contact: 'contact',
    notFound: 'notFound',
    emails: 'emails',
    console: 'console',
  },
  en: {
    settings: 'settingsEn',
    header: 'headerEn',
    mobileMenu: 'mobileMenuEn',
    themeToggle: 'themeToggleEn',
    footer: 'footerEn',
    hero: 'heroEn',
    about: 'aboutEn',
    stack: 'stackEn',
    contact: 'contactEn',
    notFound: 'notFoundEn',
    emails: 'emailsEn',
    console: 'consoleEn',
  },
} as const

export type LocalizedCollectionName<
  TCollection extends ContentCollection,
  TLocale extends Locale,
> = (typeof localizedCollectionNames)[TLocale][TCollection]

export function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale)
}

export function parseLocale(value: string | undefined): Locale {
  if (!value || !isLocale(value)) {
    throw new Error(`Unsupported locale: ${value ?? 'undefined'}`)
  }

  return value
}

export function getLocalizedCollectionName<
  TCollection extends ContentCollection,
  TLocale extends Locale,
>(
  collection: TCollection,
  locale: TLocale,
): LocalizedCollectionName<TCollection, TLocale>
export function getLocalizedCollectionName<
  TCollection extends ContentCollection,
>(
  collection: TCollection,
  locale: string,
): LocalizedCollectionName<TCollection, Locale>
export function getLocalizedCollectionName(
  collection: ContentCollection,
  locale: string,
): string {
  if (!isLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`)
  }

  const collectionName = localizedCollectionNames[locale][collection]

  if (!collectionName) {
    throw new Error(`Unsupported content collection: ${collection}`)
  }

  return collectionName
}
