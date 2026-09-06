import type { SchemaContext } from 'astro:content'
import { z } from 'astro/zod'

export const projectsContentSchema = ({ image }: SchemaContext) =>
  z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    summary: z.string().min(1),
    launch: z.string().regex(/^\d{4}-\d{2}$/),
    cover: image(),
    featured: z.number().int().positive().optional(),
  })
