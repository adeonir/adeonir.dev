import { z } from 'astro/zod'

const segmentSchema = z.object({
  text: z.string().min(1),
  href: z.string().min(1).optional(),
})

export const colophonTechnologiesSchema = z.object({
  headline: z.string().min(1),
  groups: z
    .array(
      z.object({
        label: z.string().min(1),
        paragraphs: z.array(z.array(segmentSchema).min(1)).min(1),
      }),
    )
    .length(4),
})
