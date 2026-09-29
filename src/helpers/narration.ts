import type { Locale } from './content'

export const narrationSections = ['hero', 'about', 'expertise'] as const

export type NarrationSection = (typeof narrationSections)[number]

export async function hashNarration(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  )
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

export async function narrationFile(
  locale: Locale,
  section: NarrationSection,
  spoken: string,
): Promise<string> {
  const hash = await hashNarration(spoken)
  return `/narration/${locale}/${section}.${hash.slice(0, 8)}.mp3`
}
