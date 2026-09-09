import { z } from 'astro/zod'

export const projectNavSchema = z.object({
  previous: z.string().min(1),
  next: z.string().min(1),
})
