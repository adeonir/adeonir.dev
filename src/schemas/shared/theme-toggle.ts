import { z } from 'astro/zod'

export const themeToggleSchema = z.object({
  dark: z.string().min(1),
  light: z.string().min(1),
})
