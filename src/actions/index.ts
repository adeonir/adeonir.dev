import { ActionError, defineAction } from 'astro:actions'

import { contactInputSchema } from '~/schemas/contact'
import { sendContactEmails } from '~/services/email'
import { isRateLimited } from '~/services/rate-limit'

export const server = {
  contact: defineAction({
    accept: 'form',
    input: contactInputSchema,
    handler: async (input, context) => {
      if (input.website) {
        return
      }

      if (await isRateLimited(context.clientAddress)) {
        throw new ActionError({ code: 'TOO_MANY_REQUESTS' })
      }

      await sendContactEmails(input)
    },
  }),
}
