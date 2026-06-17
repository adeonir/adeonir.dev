import { ActionError, defineAction } from 'astro:actions'
import {
  captureContactAbuse,
  captureContactFailure,
  captureContactSubmission,
  captureException,
} from '~/services/analytics'
import { ContactDeliveryError, sendContactEmails } from '~/services/email'
import { isRateLimited } from '~/services/rate-limit'
import { contactInputSchema } from '~/validations/contact'

export const server = {
  contact: defineAction({
    accept: 'form',
    input: contactInputSchema,
    handler: async (input, context) => {
      if (input.website) {
        context.locals.cfContext.waitUntil(captureContactAbuse('honeypot'))
        return
      }

      if (await isRateLimited(context.clientAddress)) {
        context.locals.cfContext.waitUntil(captureContactAbuse('rate_limit'))
        throw new ActionError({ code: 'TOO_MANY_REQUESTS' })
      }

      try {
        await sendContactEmails(input)
      } catch (error) {
        if (error instanceof ContactDeliveryError) {
          context.locals.cfContext.waitUntil(
            captureContactFailure(error.reason),
          )
        } else {
          context.locals.cfContext.waitUntil(captureException(error))
        }

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
