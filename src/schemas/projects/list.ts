import { z } from 'astro/zod'

export const projectsListSchema = z.object({
  links: z.object({
    more: z.string().min(1),
    offline: z.string().min(1),
  }),
  empty: z.string().min(1),
})
