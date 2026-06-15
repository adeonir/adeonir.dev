import { getEntry } from 'astro:content'
import { RESEND_API_KEY } from 'astro:env/server'
import { render } from '@react-email/render'
import { ptBR } from 'date-fns/locale'
import { formatInTimeZone } from 'date-fns-tz'
import { createElement } from 'react'

import { Confirmation } from '~/emails/confirmation'
import { Notification } from '~/emails/notification'

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

function fill(template: string, tokens: Record<string, string>) {
  return Object.entries(tokens).reduce(
    (text, [token, value]) => text.replaceAll(`{${token}}`, value),
    template,
  )
}

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
    throw new Error(`Resend request failed with status ${response.status}`)
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
    throw new Error('Missing emails/emails entry')
  }

  const { from, fields, confirmation, notification } = entry.data
  const firstName = name.split(' ')[0]
  const receivedAt = formatReceivedAt(new Date())
  const sender = `${from} <${OWNER}>`
  const data = { name, email, subject, message }

  const notificationHtml = await render(
    createElement(Notification, {
      ...data,
      replyTo: email,
      copy: {
        preview: fill(notification.preview, { name: firstName }),
        badge: notification.badge,
        heading: notification.heading,
        received: fill(notification.received, { date: receivedAt }),
        button: fill(notification.button, { name: firstName }),
        footer: fill(notification.footer, { name: firstName }),
        fields,
      },
    }),
  )

  const confirmationHtml = await render(
    createElement(Confirmation, {
      ...data,
      replyTo: OWNER,
      copy: {
        preview: confirmation.preview,
        heading: confirmation.heading,
        body: fill(confirmation.body, { name: firstName }),
        recapLabel: confirmation.recapLabel,
        footer: confirmation.footer,
        button: confirmation.button,
        fields,
      },
    }),
  )

  await send({
    from: sender,
    to: OWNER,
    subject: fill(notification.subject, { subject }),
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
