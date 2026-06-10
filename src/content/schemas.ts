import { z } from 'astro/zod'

export const settingsSchema = z.object({
  siteName: z.string(),
  description: z.string(),
  ogImage: z.string(),
  locale: z.string(),
})

export const headerSchema = z.object({
  logo: z.string().min(1),
  nav: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      }),
    )
    .min(1),
  menu: z.object({
    label: z.string().min(1),
    open: z.string().min(1),
    close: z.string().min(1),
  }),
})

export const footerSchema = z.object({
  brand: z.object({
    text: z.string().min(1),
    copyright: z.string().min(1),
  }),
  tagline: z
    .array(
      z.object({
        text: z.string().min(1),
        emphasis: z.boolean().optional(),
      }),
    )
    .min(1),
})
