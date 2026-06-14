import { z } from 'astro/zod'

export const contactInputSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  subject: z.string().min(1).max(120),
  message: z.string().min(1).max(2000),
  website: z.string().max(0).optional(),
})

export type ContactInput = z.infer<typeof contactInputSchema>
