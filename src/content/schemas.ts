import { z } from 'astro:content'

export const settingsSchema = z.object({
  siteName: z.string(),
  description: z.string(),
  ogImage: z.string(),
  locale: z.string(),
})
