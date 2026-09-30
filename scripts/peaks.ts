import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { MPEGDecoder } from 'mpg123-decoder'

import {
  narrationFile,
  narrationSections,
  readSpokenTexts,
  supportedLocales,
} from './audio'

export const PEAKS_BARS = 28
const PEAKS = 'src/data/peaks.json'

type Peaks = Record<string, number[]>

export function summarizePeaks(
  channelData: Float32Array[],
  count: number,
): number[] {
  const length = channelData[0]?.length ?? 0
  const loudest = Array.from({ length: count }, (_, bucket) => {
    const start = Math.floor((bucket * length) / count)
    const end = Math.floor(((bucket + 1) * length) / count)
    let max = 0
    for (const channel of channelData) {
      for (let index = start; index < end; index++) {
        max = Math.max(max, Math.abs(channel[index] ?? 0))
      }
    }
    return max
  })
  const top = Math.max(...loudest)
  return loudest.map((value) =>
    top > 0 ? Math.round((value / top) * 100) / 100 : 0,
  )
}

async function decodePeaks(audio: string): Promise<number[]> {
  const bytes = new Uint8Array(await readFile(audio))
  const decoder = new MPEGDecoder()
  try {
    await decoder.ready
    const { channelData, errors } = decoder.decode(bytes)
    if (errors.length > 0) {
      throw new Error(`Decoding ${audio} failed: ${errors[0]?.message}`)
    }
    return summarizePeaks(channelData, PEAKS_BARS)
  } finally {
    decoder.free()
  }
}

async function readPeaks(path: string): Promise<Peaks> {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return {}
  }
}

export async function generatePeaks(): Promise<void> {
  const path = join(process.cwd(), PEAKS)
  const existing = await readPeaks(path)
  const peaks: Peaks = {}

  for (const locale of supportedLocales) {
    const spoken = await readSpokenTexts(locale)
    for (const section of narrationSections) {
      const file = await narrationFile(locale, section, spoken[section])
      const kept = existing[file]
      if (kept?.length === PEAKS_BARS) {
        peaks[file] = kept
        continue
      }
      try {
        peaks[file] = await decodePeaks(join(process.cwd(), 'public', file))
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          throw new Error(`${file} is missing; run pnpm audio`)
        }
        throw error
      }
    }
  }

  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(peaks, null, 2)}\n`)
}

if (import.meta.main) {
  generatePeaks().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}
