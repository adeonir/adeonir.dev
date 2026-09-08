import { z } from 'astro/zod'

export const projectHeaderSchema = z.object({
  back: z.string().min(1),
})
