import { z } from 'astro/zod'

export const homeStackSchema = z.object({
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
  tools: z
    .array(
      z.object({
        title: z.string().min(1),
        items: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
})
