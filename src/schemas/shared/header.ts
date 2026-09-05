import { z } from 'astro/zod'

export const sharedHeaderSchema = z.object({
  logo: z.string().min(1),
  nav: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      }),
    )
    .min(1),
})
