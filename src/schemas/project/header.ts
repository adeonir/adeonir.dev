import { z } from 'astro/zod'

export const projectHeaderSchema = z.object({
  back: z.string().min(1),
  links: z.object({
    site: z.string().min(1),
    repository: z.string().min(1),
  }),
})
