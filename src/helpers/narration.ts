export const narrationSections = ['hero', 'about', 'expertise'] as const

export type NarrationSection = (typeof narrationSections)[number]

export const NARRATION_BARS = 28

// FNV-1a hash of the seed feeds a mulberry32 generator, so a seed always yields the same bars
export function placeholderPeaks(seed: string, count: number) {
  let hash = 2166136261
  for (const char of seed) {
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  }
  let state = hash >>> 0

  return Array.from({ length: count }, () => {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = Math.imul(state ^ (state >>> 15), state | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    const unit = ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
    return Math.round((0.25 + unit * 0.75) * 100) / 100
  })
}
