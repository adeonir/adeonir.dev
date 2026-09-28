import { z } from 'astro/zod'

export const homeNarrationSchema = z.object({
  label: z.string().min(1),
  names: z.object({
    hero: z.string().min(1),
    about: z.string().min(1),
    expertise: z.string().min(1),
  }),
  error: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  spoken: z.object({
    hero: z.string().min(1),
    about: z.string().min(1),
    expertise: z.string().min(1),
  }),
})
