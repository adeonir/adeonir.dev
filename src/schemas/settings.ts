import { z } from 'astro/zod'

export const settingsSchema = z.object({
  siteName: z.string(),
  description: z.string(),
  ogImage: z.string(),
  locale: z.string(),
  agentDocument: z.object({
    sections: z.object({
      hero: z.string(),
      about: z.string(),
      expertise: z.string(),
      stack: z.string(),
      contact: z.string(),
    }),
  }),
  pageTitles: z.object({
    home: z.string(),
    notFound: z.string(),
    maintenance: z.string(),
  }),
})
