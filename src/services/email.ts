import { RESEND_API_KEY } from 'astro:env/server'
import { render } from '@react-email/render'
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
const FROM = 'Adeonir <contato@adeonir.dev>'
const OWNER = 'contato@adeonir.dev'

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

function formatReceivedAt(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export async function sendContactEmails({
  name,
  email,
  subject,
  message,
}: ContactEmailInput) {
  const receivedAt = formatReceivedAt(new Date())

  const notificationHtml = await render(
    createElement(Notification, { name, email, subject, message, receivedAt }),
  )
  const confirmationHtml = await render(
    createElement(Confirmation, { name, email, subject, message }),
  )

  await send({
    from: FROM,
    to: OWNER,
    subject: `Novo contato: ${subject}`,
    html: notificationHtml,
    reply_to: email,
  })

  await send({
    from: FROM,
    to: email,
    subject: 'Recebi sua mensagem',
    html: confirmationHtml,
  })
}
