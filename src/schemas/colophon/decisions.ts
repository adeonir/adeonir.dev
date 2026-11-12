import { z } from 'astro/zod'

export const colophonDecisionsSchema = z.object({
  headline: z.string().min(1),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .length(4),
})
