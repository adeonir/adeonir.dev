import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { parse } from 'yaml'

import { type Locale, supportedLocales } from '~/helpers/content'
import { narrationFile, narrationSections } from '~/helpers/narration'
import { homeNarrationSchema } from '~/schemas/home/narration'
import { narrationEnvSchema } from '~/validations/narration'

const ENDPOINT = 'https://api.elevenlabs.io/v1/text-to-dialogue'
const OUTPUT_FORMAT = 'mp3_44100_128'
const MODEL_ID = 'eleven_v4'
const SETTINGS = { stability: 0.35, similarity: 0.5 }

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

async function readSpokenTexts(locale: Locale) {
  const source = join(
    process.cwd(),
    `src/content/home/${locale}/narration.yaml`,
  )
  const entry = homeNarrationSchema.parse(parse(await readFile(source, 'utf8')))
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
  const env = narrationEnvSchema.safeParse(process.env)
  if (!env.success) {
    const missing = env.error.issues.map((issue) => issue.path.join('.'))
    console.error(`Missing environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }
  const { ELEVENLABS_API_KEY: apiKey, ELEVENLABS_VOICE_ID: voiceId } = env.data

  for (const locale of supportedLocales) {
    const spoken = await readSpokenTexts(locale)

    for (const section of narrationSections) {
      const key = `${locale}/${section}`
      const text = spoken[section]
      const audio = join(
        process.cwd(),
        'public',
        await narrationFile(locale, section, text),
      )

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
}

if (import.meta.main) {
  generateNarrations().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
