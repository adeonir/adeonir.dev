import { z } from 'astro/zod'

export const sharedConsoleSchema = z.object({
  greeting: z.string().min(1),
})
