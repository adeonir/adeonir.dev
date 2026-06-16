import { actions } from 'astro:actions'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Field } from '~/components/ui/field'
import { useForm } from '~/hooks/use-form'
import {
  type ContactValidationMessages,
  createContactSchema,
  UTM_KEYS,
} from '~/schemas/contact'

type FieldContent = {
  name: string
  label: string
  placeholder: string
}

type ContactFormContent = {
  fields: FieldContent[]
  submit: string
  states: {
    success: string
    error: string
  }
  validation: ContactValidationMessages
}

type ContactFormProps = {
  content: ContactFormContent
}

export function ContactForm({ content }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const { errors, isSubmitting, handleSubmit, handleInput } = useForm({
    validate: (formData) => {
      const schema = createContactSchema(content.validation)
      const result = schema.safeParse(Object.fromEntries(formData))

      if (!result.success) {
        const fieldErrors: Record<string, string> = {}
        for (const issue of result.error.issues) {
          const field = issue.path[0]
          if (typeof field !== 'string' || field === 'website') continue
          if (fieldErrors[field]) continue
          fieldErrors[field] = issue.message
        }
        return fieldErrors
      }

      return null
    },
    onSubmit: async (formData) => {
      const params = new URLSearchParams(window.location.search)
      for (const key of UTM_KEYS) {
        const value = params.get(key)
        if (value) {
          formData.set(key, value)
        }
      }

      try {
        const result = await actions.contact(formData)
        setStatus(result.error ? 'error' : 'success')
      } catch {
        setStatus('error')
      }
    },
  })

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex flex-col gap-2 rounded-lg border border-border bg-card p-6"
      >
        <p className="text-pretty text-body text-foreground">
          {content.states.success}
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div
        role="alert"
        className="flex flex-col gap-2 rounded-lg border border-border bg-card p-6"
      >
        <p className="text-pretty text-body text-foreground">
          {content.states.error}
        </p>
      </div>
    )
  }

  return (
    <form
      method="post"
      action={actions.contact.queryString}
      onSubmit={handleSubmit}
      onInput={handleInput}
      noValidate
      className="flex flex-col gap-6"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />
      {content.fields.map((field) => (
        <Field
          key={field.name}
          label={field.label}
          name={field.name}
          placeholder={field.placeholder}
          type={field.name === 'email' ? 'email' : 'text'}
          multiline={field.name === 'message'}
          required
          invalid={!!errors[field.name]}
          error={errors[field.name]}
        />
      ))}
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="w-fit"
      >
        {content.submit}
      </Button>
    </form>
  )
}
