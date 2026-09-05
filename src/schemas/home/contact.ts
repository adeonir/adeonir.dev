import { z } from 'astro/zod'

export const homeContactSchema = z.object({
  eyebrow: z.string().min(1),
  title: z
    .array(
      z.object({
        text: z.string().min(1),
        highlight: z.boolean().optional(),
      }),
    )
    .min(1),
  body: z.string().min(1),
  social: z
    .array(
      z.object({
        platform: z.enum(['email', 'github', 'linkedin', 'x']),
        label: z.string().min(1),
        link: z.string().min(1),
      }),
    )
    .min(1),
  form: z.object({
    fields: z
      .array(
        z.object({
          name: z.string().min(1),
          label: z.string().min(1),
          placeholder: z.string().min(1),
        }),
      )
      .min(1),
    submit: z.string().min(1),
    states: z.object({
      success: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
      error: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    }),
    validation: z.object({
      required: z.string().min(1),
      email: z.string().min(1),
      maxLength: z.string().min(1),
    }),
  }),
})
