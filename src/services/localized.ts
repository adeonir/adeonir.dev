import {
  type CollectionEntry,
  type CollectionKey,
  getEntry,
} from 'astro:content'

import type { Locale } from '~/helpers/content'

export async function getLocalizedEntry<TCollection extends CollectionKey>(
  collection: TCollection,
  locale: Locale,
): Promise<CollectionEntry<TCollection>> {
  const id = `${locale}/${collection}`
  const entry = await getEntry(collection, id)

  if (!entry) {
    throw new Error(`Missing localized content: ${id}`)
  }

  return entry as CollectionEntry<TCollection>
}
