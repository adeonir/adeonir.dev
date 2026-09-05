import { z } from 'astro/zod'

const emptySegmentSchema = z.object({
  text: z.string().min(1),
  href: z.string().min(1).optional(),
})

export const projectsSchema = z.object({
  eyebrow: z.string().min(1),
  headline: z
    .array(
      z.object({
        text: z.string().min(1),
        highlight: z.boolean().optional(),
      }),
    )
    .min(1),
  body: z.string().min(1),
  empty: z.array(emptySegmentSchema).min(1),
})
