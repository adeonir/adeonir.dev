import { defineAction } from 'astro:actions'

import { contactInputSchema } from '~/schemas/contact'
import { sendContactEmails } from '~/services/email'

export const server = {
  contact: defineAction({
    accept: 'form',
    input: contactInputSchema,
    handler: async (input) => {
      await sendContactEmails(input)
    },
  }),
}
