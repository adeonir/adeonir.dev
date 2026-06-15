import { ActionError, defineAction } from 'astro:actions'

import { contactInputSchema } from '~/schemas/contact'
import { captureContactSubmission } from '~/services/analytics'
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

      try {
        await sendContactEmails(input)
      } catch {
        throw new ActionError({ code: 'INTERNAL_SERVER_ERROR' })
      }

      context.locals.cfContext.waitUntil(
        captureContactSubmission({
          utm_source: input.utm_source,
          utm_medium: input.utm_medium,
          utm_campaign: input.utm_campaign,
        }),
      )
    },
  }),
}
