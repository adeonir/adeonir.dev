import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { parse } from 'yaml'
import { z } from 'zod'

const ENDPOINT = 'https://api.elevenlabs.io/v1/text-to-dialogue'
const OUTPUT_FORMAT = 'mp3_44100_128'
const MODEL_ID = 'eleven_v4'
const SETTINGS = { stability: 0.35, similarity: 0.5 }
const MANIFEST = 'src/data/audio.json'

export const supportedLocales = ['pt', 'en'] as const

export type Locale = (typeof supportedLocales)[number]

export const narrationSections = ['hero', 'about', 'expertise'] as const

export type NarrationSection = (typeof narrationSections)[number]

const envSchema = z.object({
  ELEVENLABS_API_KEY: z.string().min(1),
  ELEVENLABS_VOICE_ID: z.string().min(1),
})

const spokenSchema = z.object({
  spoken: z.object({
    hero: z.string().min(1),
    about: z.string().min(1),
    expertise: z.string().min(1),
  }),
})

export type AudioManifest = Record<Locale, Record<NarrationSection, string>>

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

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function removeOlderFiles(audio: string, section: string): Promise<void> {
  const directory = dirname(audio)
  for (const file of await readdir(directory)) {
    if (file.startsWith(`${section}.`) && file !== basename(audio)) {
      await rm(join(directory, file))
    }
  }
}

export function manifestPath(): string {
  return join(process.cwd(), MANIFEST)
}

export async function readSpokenTexts(locale: Locale) {
  const source = join(
    process.cwd(),
    `src/content/home/${locale}/narration.yaml`,
  )
  const entry = spokenSchema.parse(parse(await readFile(source, 'utf8')))
  return entry.spoken
}

export async function synthesize(
  text: string,
  locale: Locale,
  apiKey: string,
  voiceId: string,
): Promise<Uint8Array> {
  const response = await fetch(`${ENDPOINT}?output_format=${OUTPUT_FORMAT}`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      inputs: [{ text, voice_id: voiceId }],
      model_id: MODEL_ID,
      language_code: locale,
      settings: SETTINGS,
    }),
  })
  if (!response.ok) {
    throw new Error(
      `ElevenLabs answered ${response.status}: ${await response.text()}`,
    )
  }
  return new Uint8Array(await response.arrayBuffer())
}

export async function generateNarrations(): Promise<void> {
  const env = envSchema.safeParse(process.env)
  if (!env.success) {
    const missing = env.error.issues.map((issue) => issue.path.join('.'))
    console.error(`Missing environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }
  const { ELEVENLABS_API_KEY: apiKey, ELEVENLABS_VOICE_ID: voiceId } = env.data
  const manifest = {} as AudioManifest

  for (const locale of supportedLocales) {
    const spoken = await readSpokenTexts(locale)
    manifest[locale] = {} as AudioManifest[Locale]

    for (const section of narrationSections) {
      const key = `${locale}/${section}`
      const text = spoken[section]
      const file = await narrationFile(locale, section, text)
      const audio = join(process.cwd(), 'public', file)
      manifest[locale][section] = file

      if (await fileExists(audio)) {
        console.log(`Up to date: ${key}`)
        continue
      }

      console.log(`Regenerating: ${key}`)
      const bytes = await synthesize(text, locale, apiKey, voiceId)
      await mkdir(dirname(audio), { recursive: true })
      await writeFile(audio, bytes)
      await removeOlderFiles(audio, section)
    }
  }

  await mkdir(dirname(manifestPath()), { recursive: true })
  await writeFile(manifestPath(), `${JSON.stringify(manifest, null, 2)}\n`)
}

if (import.meta.main) {
  generateNarrations().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
