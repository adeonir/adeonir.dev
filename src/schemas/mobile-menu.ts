import { z } from 'astro/zod'

export const mobileMenuSchema = z.object({
  label: z.string().min(1),
  trigger: z.object({
    open: z.string().min(1),
    close: z.string().min(1),
  }),
})
