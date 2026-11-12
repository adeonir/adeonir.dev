import { z } from 'astro/zod'

export const colophonMotivationSchema = z.object({
  headline: z.string().min(1),
  body: z.string().min(1),
})
