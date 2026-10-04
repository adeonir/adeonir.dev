import { z } from 'astro/zod'

export const sharedThemeToggleSchema = z.object({
  label: z.string().min(1),
  switchToLight: z.string().min(1),
  switchToDark: z.string().min(1),
})
