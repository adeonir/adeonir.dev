import { z } from 'astro/zod'

export const emailsSchema = z.object({
  from: z.string().min(1),
  fields: z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    subject: z.string().min(1),
    message: z.string().min(1),
  }),
  confirmation: z.object({
    subject: z.string().min(1),
    preview: z.string().min(1),
    heading: z.string().min(1),
    body: z.string().min(1),
    recapLabel: z.string().min(1),
    footer: z.string().min(1),
  }),
  notification: z.object({
    subject: z.string().min(1),
    preview: z.string().min(1),
    badge: z.string().min(1),
    heading: z.string().min(1),
    received: z.string().min(1),
    footer: z.string().min(1),
  }),
})
