import { z } from 'astro/zod'

const bioSegmentSchema = z.object({
  text: z.string().min(1),
  href: z.url().optional(),
})

export const homeAboutSchema = z.object({
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
  bio: z.array(z.array(bioSegmentSchema).min(1)).min(1),
})
