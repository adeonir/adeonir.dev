import { z } from 'astro/zod'

export const aboutSchema = z.object({
  eyebrow: z.string().min(1),
  headline: z
    .array(
      z.object({
        text: z.string().min(1),
        strong: z.boolean().optional(),
        break: z.boolean().optional(),
      }),
    )
    .min(1),
  bio: z.array(z.string().min(1)).min(1),
})
