import { z } from 'astro/zod'

export const projectsHeroSchema = z.object({
  headline: z
    .array(
      z.object({
        text: z.string().min(1),
        highlight: z.boolean().optional(),
      }),
    )
    .min(1),
  subheadline: z.string().min(1),
})
