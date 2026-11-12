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

// Lowest bar height, so a quiet stretch still shows a bar
const FLOOR = 0.25

// Each bar is the RMS of its stretch rather than its loudest sample, because
// every second of speech holds one loud syllable and the maximum flattens the
// bars. The range is stretched between the quietest and loudest stretch, so
// the emphasis in the voice reads as height.
export function summarizePeaks(
  channelData: Float32Array[],
  count: number,
): number[] {
  const length = channelData[0]?.length ?? 0
  const energy = Array.from({ length: count }, (_, bucket) => {
    const start = Math.floor((bucket * length) / count)
    const end = Math.floor(((bucket + 1) * length) / count)
    let sum = 0
    let samples = 0
    for (const channel of channelData) {
      for (let index = start; index < end; index++) {
        sum += (channel[index] ?? 0) ** 2
        samples++
      }
    }
    return samples > 0 ? Math.sqrt(sum / samples) : 0
  })
  const low = Math.min(...energy)
  const range = Math.max(...energy) - low
  return energy.map((value) => {
    const share = range > 0 ? (value - low) / range : 1
    return Math.round((FLOOR + (1 - FLOOR) * share) * 100) / 100
  })
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
      if (kept?.length === PEAKS_BARS && !process.argv.includes('--force')) {
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
