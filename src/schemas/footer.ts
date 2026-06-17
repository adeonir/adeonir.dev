import { z } from 'astro/zod'

export const footerSchema = z.object({
  brand: z.object({
    text: z.string().min(1),
    copyright: z.string().min(1),
  }),
  tagline: z
    .array(
      z.object({
        text: z.string().min(1),
        emphasis: z.boolean().optional(),
      }),
    )
    .min(1),
})
