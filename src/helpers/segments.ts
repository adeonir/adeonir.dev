export type TextSegment = {
  text: string
  highlight?: boolean
  href?: string
}

export function joinSegments(segments: TextSegment[]): string {
  return segments.map((segment) => segment.text).join('')
}
