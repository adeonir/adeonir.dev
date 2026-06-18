import { getEntry } from 'astro:content'
import { RESEND_API_KEY } from 'astro:env/server'
import { render } from '@react-email/render'
import { ptBR } from 'date-fns/locale'
import { formatInTimeZone } from 'date-fns-tz'
import { createElement } from 'react'

import { Confirmation } from '~/emails/confirmation'
import { Notification } from '~/emails/notification'
import { interpolate } from '~/helpers/interpolate'

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

function formatReceivedAt(date: Date) {
  return formatInTimeZone(date, 'America/Sao_Paulo', 'dd MMM yyyy, HH:mm', {
    locale: ptBR,
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
}: ContactEmailInput) {
  const entry = await getEntry('emails', 'emails')

  if (!entry) {
    throw new ContactDeliveryError(
      'missing_content',
      'Missing emails/emails entry',
    )
  }

  const { from, fields, confirmation, notification } = entry.data
  const firstName = name.split(' ')[0]
  const receivedAt = formatReceivedAt(new Date())
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
