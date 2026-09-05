import { z } from 'astro/zod'

export const homeHeroSchema = z.object({
  eyebrow: z.string().min(1),
  display: z.string().min(1),
  tagline: z
    .array(
      z.object({
        text: z.string().min(1),
        highlight: z.boolean().optional(),
      }),
    )
    .min(1),
  description: z.string().min(1),
  actions: z.object({
    primary: z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    }),
    secondary: z.object({
      label: z.string().min(1),
      href: z.string().min(1),
    }),
  }),
  scroll: z.string().min(1),
})
