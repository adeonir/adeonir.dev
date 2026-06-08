import { z } from 'astro:content'

export const settingsSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string(),
  locale: z.string(),
})
