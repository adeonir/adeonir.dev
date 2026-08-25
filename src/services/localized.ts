import { type CollectionEntry, getEntry } from 'astro:content'
import {
  type ContentCollection,
  getLocalizedCollectionName,
  type Locale,
  type LocalizedCollectionName,
} from '~/helpers/content'

export type LocalizedEntry<TCollection extends ContentCollection> =
  CollectionEntry<LocalizedCollectionName<TCollection, Locale>>

export async function getLocalizedEntry<TCollection extends ContentCollection>(
  collection: TCollection,
  entryId: string,
  locale: Locale,
): Promise<LocalizedEntry<TCollection>> {
  const localizedCollectionName = getLocalizedCollectionName(collection, locale)
  const entry = await getEntry(localizedCollectionName, entryId)

  if (!entry) {
    throw new Error(
      `Missing localized content: ${localizedCollectionName}/${entryId}`,
    )
  }

  return entry as LocalizedEntry<TCollection>
}
