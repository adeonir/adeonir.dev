import { z } from 'astro/zod'

export const languageToggleSchema = z.object({
  code: z.string().length(2),
  name: z.string().min(1),
})
