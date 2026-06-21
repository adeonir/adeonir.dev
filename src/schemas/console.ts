import { z } from 'astro/zod'

export const consoleSchema = z.object({
  greeting: z.string().min(1),
})
