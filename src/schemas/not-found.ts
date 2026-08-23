import { z } from 'astro/zod'

export const notFoundSchema = z.object({
  eyebrow: z.string().min(1),
  display: z.string().min(1),
  headline: z
    .array(
      z.object({
        text: z.string().min(1),
        highlight: z.boolean().optional(),
      }),
    )
    .min(1),
  body: z.array(z.string().min(1)).min(1),
  action: z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  }),
})
