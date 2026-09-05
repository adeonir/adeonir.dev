import { RESEND_API_KEY } from 'astro:env/server'
import { render } from '@react-email/render'
import { enUS, ptBR } from 'date-fns/locale'
import { formatInTimeZone } from 'date-fns-tz'
import { createElement } from 'react'

import { Confirmation } from '~/emails/confirmation'
import { Notification } from '~/emails/notification'
import type { Locale } from '~/helpers/content'
import { interpolate } from '~/helpers/interpolate'
import { getLocalizedEntry } from '~/services/localized'

export class ContactDeliveryError extends Error {
  reason: 'resend_error' | 'missing_content'

  constructor(reason: 'resend_error' | 'missing_content', message: string) {
    super(message)
    this.reason = reason
    this.name = 'ContactDeliveryError'
  }
}

type ContactEmailInput = {
  name: string
  email: string
  subject: string
  message: string
  locale: Locale
}

type ResendPayload = {
  from: string
  to: string
  subject: string
  html: string
  reply_to?: string
}

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const OWNER = 'contato@adeonir.dev'

const dateLocales = {
  pt: ptBR,
  en: enUS,
} as const

function formatReceivedAt(date: Date, locale: Locale) {
  return formatInTimeZone(date, 'America/Sao_Paulo', 'dd MMM yyyy, HH:mm', {
    locale: dateLocales[locale],
  })
}

async function send(payload: ResendPayload) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new ContactDeliveryError(
      'resend_error',
      `Resend request failed with status ${response.status}`,
    )
  }
}

export async function sendContactEmails({
  name,
  email,
  subject,
  message,
  locale,
}: ContactEmailInput) {
  const entry = await getLocalizedEntry('sharedEmails', locale).catch(
    (error) => {
      if (
        error instanceof Error &&
        error.message.startsWith('Missing localized content:')
      ) {
        throw new ContactDeliveryError('missing_content', error.message)
      }

      throw error
    },
  )

  const { from, fields, confirmation, notification } = entry.data
  const firstName = name.split(' ')[0]
  const receivedAt = formatReceivedAt(new Date(), locale)
  const sender = `${from} <${OWNER}>`
  const data = { name, email, subject, message }

  const notificationHtml = await render(
    createElement(Notification, {
      ...data,
      copy: {
        preview: interpolate(notification.preview, { name: firstName }),
        badge: notification.badge,
        heading: notification.heading,
        received: interpolate(notification.received, { date: receivedAt }),
        footer: interpolate(notification.footer, { name: firstName }),
        fields,
      },
    }),
  )

  const confirmationHtml = await render(
    createElement(Confirmation, {
      ...data,
      copy: {
        preview: confirmation.preview,
        heading: confirmation.heading,
        body: interpolate(confirmation.body, { name: firstName }),
        recapLabel: confirmation.recapLabel,
        footer: confirmation.footer,
        fields,
      },
    }),
  )

  await send({
    from: sender,
    to: OWNER,
    subject: interpolate(notification.subject, { subject }),
    html: notificationHtml,
    reply_to: email,
  })

  await send({
    from: sender,
    to: email,
    subject: confirmation.subject,
    html: confirmationHtml,
  })
}
