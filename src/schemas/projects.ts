import { z } from 'astro/zod'

// The holding message links to a section on the same page, so `href` is a
// non-empty string rather than an absolute URL.
const holdingSegmentSchema = z.object({
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
  holding: z.array(holdingSegmentSchema).min(1),
})
