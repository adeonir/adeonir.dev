import { z } from 'astro/zod'

const actionSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

export const sharedNotFoundSchema = z.object({
  display: z.string().min(1),
  headline: z
    .array(
      z.object({
        text: z.string().min(1),
        highlight: z.boolean().optional(),
      }),
    )
    .min(1),
  body: z.array(z.string().min(1)).min(1),
  action: actionSchema,
  paths: z.record(
    z.string(),
    z.object({
      body: z.array(z.string().min(1)).min(1),
      action: actionSchema,
    }),
  ),
})
