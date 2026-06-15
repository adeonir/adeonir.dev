import { z } from 'zod'

export type ContactValidationMessages = {
  required: string
  email: string
  maxLength: string
}

export function createContactSchema(messages?: ContactValidationMessages) {
  return z.object({
    name: z.string().min(1, messages?.required),
    email: z.email(messages?.email),
    subject: z
      .string()
      .min(1, messages?.required)
      .max(120, messages?.maxLength?.replace('{max}', '120')),
    message: z
      .string()
      .min(1, messages?.required)
      .max(2000, messages?.maxLength?.replace('{max}', '2000')),
    website: z.string().optional(),
  })
}

export const contactInputSchema = createContactSchema()

export type ContactInput = z.infer<typeof contactInputSchema>

export type ContactFormSchema = ReturnType<typeof createContactSchema>
