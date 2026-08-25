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
  required: 'This field is required',
  email: 'Enter a valid email',
  maxLength: 'Maximum {max} characters',
}

describe('contact validation', () => {
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
