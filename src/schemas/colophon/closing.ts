import { z } from 'astro/zod'

export const colophonClosingSchema = z.object({
  headline: z.string().min(1),
  action: z.string().min(1),
})
