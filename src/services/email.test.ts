import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const fetchMock = vi.hoisted(() => vi.fn())

const getEntry = vi.hoisted(() => vi.fn())

vi.mock('astro:content', () => ({ getEntry }))
vi.mock('astro:env/server', () => ({ RESEND_API_KEY: 'test-key' }))

import { sendContactEmails } from '~/services/email'

const englishEmailEntry = {
  id: 'en/sharedEmails',
  collection: 'sharedEmails',
  data: {
    from: 'Adeonir',
    fields: {
      name: 'name',
      email: 'email',
      subject: 'subject',
      message: 'message',
    },
    confirmation: {
      subject: 'Got your message',
      preview: "I'll reply as soon as I can.",
      heading: 'Your message was sent',
      body: "Hi, {name}! Thanks for reaching out. I got your message and I'll reply as soon as I can.",
      recapLabel: 'What you sent',
      footer:
        'Need to add anything? Just reply to this email and it comes straight to me.',
    },
    notification: {
      subject: 'New contact: {subject}',
      preview: 'New message from {name} via the contact form.',
      badge: 'New contact',
      heading: 'New contact message',
      received: 'Received on {date}',
      footer:
        'Automatic notification from the site contact form. Reply to this email to talk directly with {name}.',
    },
  },
}

describe('sendContactEmails', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-25T15:30:00.000Z'))
    getEntry.mockReset()
    getEntry.mockResolvedValue(englishEmailEntry)
    fetchMock.mockReset()
    fetchMock.mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('sends English confirmation and notification emails with an English date', async () => {
    await sendContactEmails({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      subject: 'Saying hello',
      message: 'Just reaching out about a project.',
      locale: 'en',
    })

    expect(getEntry).toHaveBeenCalledWith('sharedEmails', 'en/sharedEmails')

    const payloads = fetchMock.mock.calls.map(([, request]) =>
      JSON.parse(request.body as string),
    )

    expect(payloads[0].subject).toBe('New contact: Saying hello')
    expect(payloads[0].html).toContain('New contact message')
    expect(payloads[0].html).toContain('Received on 25 Aug 2026, 12:30')
    expect(payloads[1].subject).toBe('Got your message')
    expect(payloads[1].html).toContain('Your message was sent')
  })
})
