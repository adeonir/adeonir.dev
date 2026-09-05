import { z } from 'astro/zod'

export const sharedThemeToggleSchema = z.object({
  dark: z.string().min(1),
  light: z.string().min(1),
})
