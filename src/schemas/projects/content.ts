import type { SchemaContext } from 'astro:content'
import { z } from 'astro/zod'

export const projectsContentSchema = ({ image }: SchemaContext) =>
  z
    .object({
      name: z.string().min(1),
      category: z.string().min(1),
      summary: z.string().min(1),
      launch: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      stack: z.array(z.string().min(1)).min(1),
      url: z.url().optional(),
      cover: image().optional(),
      featured: z.number().int().positive().optional(),
    })
    .refine((entry) => entry.featured === undefined || entry.cover, {
      path: ['cover'],
      message: 'A featured project needs a cover',
    })
