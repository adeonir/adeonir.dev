import { describe, expect, it } from 'vitest'

import { contactInputSchema, createContactSchema } from '~/validations/contact'

const validInput = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  subject: 'Saying hello',
  message: 'Just reaching out about a project.',
  locale: 'en',
}

const messages = {
  required: {
    name: 'Name is required',
    email: 'Email is required',
    message: 'Message is required',
  },
  email: 'Enter a valid email',
  maxLength: 'Maximum {max} characters',
}

describe('contact validation', () => {
  it.each(['name', 'email', 'message'] as const)(
    'reports the empty-field message for each required field (%s)',
    (field) => {
      const schema = createContactSchema(messages)
      const result = schema.safeParse({ ...validInput, [field]: '' })

      expect(result.success).toBe(false)
      if (!result.success) {
        const issues = result.error.issues.filter(
          (entry) => entry.path[0] === field,
        )
        expect(issues.map((issue) => issue.message)).toEqual([
          messages.required[field],
        ])
      }
    },
  )

  it.each(['name', 'message'] as const)(
    'reports the empty-field message for a name or message of only spaces (%s)',
    (field) => {
      const schema = createContactSchema(messages)
      const result = schema.safeParse({ ...validInput, [field]: '   ' })

      expect(result.success).toBe(false)
      if (!result.success) {
        const issues = result.error.issues.filter(
          (entry) => entry.path[0] === field,
        )
        expect(issues.map((issue) => issue.message)).toEqual([
          messages.required[field],
        ])
      }
    },
  )

  it.each([
    ['absent', undefined],
    ['empty', ''],
  ])('accepts a submission without a subject (%s)', (_, subject) => {
    const schema = createContactSchema(messages)
    const result = schema.safeParse({ ...validInput, subject })

    expect(result.success).toBe(true)
  })

  it('treats a subject of only spaces as no subject', () => {
    const schema = createContactSchema(messages)
    const result = schema.safeParse({ ...validInput, subject: '   ' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.subject).toBe('')
    }
  })

  it('accepts a valid submission with optional fields absent', () => {
    expect(contactInputSchema.safeParse(validInput).success).toBe(true)
  })

  it('accepts optional fields when present', () => {
    const result = contactInputSchema.safeParse({
      ...validInput,
      website: '',
      utm_source: 'newsletter',
      utm_medium: 'email',
      utm_campaign: 'launch',
    })

    expect(result.success).toBe(true)
  })

  it('rejects an empty required field', () => {
    expect(
      contactInputSchema.safeParse({ ...validInput, name: '' }).success,
    ).toBe(false)
  })

  it('rejects an invalid email', () => {
    expect(
      contactInputSchema.safeParse({ ...validInput, email: 'not-an-email' })
        .success,
    ).toBe(false)
  })

  it('rejects a missing locale', () => {
    const inputWithoutLocale = { ...validInput }
    Reflect.deleteProperty(inputWithoutLocale, 'locale')

    expect(contactInputSchema.safeParse(inputWithoutLocale).success).toBe(false)
  })

  it('rejects an unsupported locale', () => {
    expect(
      contactInputSchema.safeParse({ ...validInput, locale: 'es' }).success,
    ).toBe(false)
  })

  it('rejects a subject over the limit and reports the cap', () => {
    const schema = createContactSchema(messages)
    const result = schema.safeParse({ ...validInput, subject: 'x'.repeat(121) })

    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find(
        (entry) => entry.path[0] === 'subject',
      )
      expect(issue?.message).toContain('120')
    }
  })

  it('rejects a message over the limit and reports the cap', () => {
    const schema = createContactSchema(messages)
    const result = schema.safeParse({
      ...validInput,
      message: 'x'.repeat(2001),
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find(
        (entry) => entry.path[0] === 'message',
      )
      expect(issue?.message).toContain('2000')
    }
  })
})
