import { z } from 'zod'
import { supportedLocales } from '~/helpers/content'

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const

export type UtmKey = (typeof UTM_KEYS)[number]
export type UtmTags = Partial<Record<UtmKey, string>>

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
    locale: z.enum(supportedLocales),
    website: z.string().optional(),
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
  })
}

export const contactInputSchema = createContactSchema()

export type ContactInput = z.infer<typeof contactInputSchema>

export type ContactFormSchema = ReturnType<typeof createContactSchema>
