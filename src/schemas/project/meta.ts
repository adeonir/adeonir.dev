import { z } from 'astro/zod'

export const projectMetaSchema = z.object({
  launch: z.string().min(1),
  role: z.string().min(1),
  type: z.string().min(1),
  stack: z.string().min(1),
})
