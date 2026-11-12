import { z } from 'astro/zod'

export const colophonOpeningSchema = z.object({
  back: z.string().min(1),
  eyebrow: z.string().min(1),
  headline: z
    .array(
      z.object({
        text: z.string().min(1),
        highlight: z.boolean().optional(),
      }),
    )
    .min(1),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
        external: z.boolean().optional(),
      }),
    )
    .min(1),
})
