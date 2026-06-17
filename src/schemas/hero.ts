import { z } from 'astro/zod'

export const heroSchema = z.object({
  eyebrow: z.string().min(1),
  display: z.object({
    greeting: z.string().min(1),
    name: z.string().min(1),
  }),
  tagline: z
    .array(
      z.object({
        text: z.string().min(1),
        strong: z.boolean().optional(),
        break: z.boolean().optional(),
      }),
    )
    .min(1),
  description: z.array(z.string().min(1)).min(1),
  actions: z.object({
    secondary: z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    }),
  }),
})
