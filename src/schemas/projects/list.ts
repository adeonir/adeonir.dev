import { z } from 'astro/zod'

export const projectsListSchema = z.object({
  labels: z.object({
    year: z.string().min(1),
    project: z.string().min(1),
    stack: z.string().min(1),
    link: z.string().min(1),
  }),
  links: z.object({
    more: z.string().min(1),
    offline: z.string().min(1),
  }),
  empty: z.string().min(1),
})
