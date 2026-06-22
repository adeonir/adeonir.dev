import { actions } from 'astro:actions'
import { useRef } from 'react'
import { toaster } from '~/components/islands/toaster'
import { Button } from '~/components/ui/button'
import { Field } from '~/components/ui/field'
import { useForm } from '~/hooks/use-form'
import {
  type ContactValidationMessages,
  createContactSchema,
  UTM_KEYS,
} from '~/validations/contact'

type ContactFormContent = {
  fields: {
    name: string
    label: string
    placeholder: string
  }[]
  submit: string
  states: {
    success: {
      title: string
      description: string
    }
    error: {
      title: string
      description: string
    }
  }
  validation: ContactValidationMessages
}

type ContactFormProps = {
  content: ContactFormContent
}

export function ContactForm({ content }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const [nameField, emailField, ...stackedFields] = content.fields

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
        if (result.error) {
          toaster.error({ ...content.states.error, duration: Infinity })
        } else {
          toaster.success(content.states.success)
          formRef.current?.reset()
        }
      } catch {
        toaster.error({ ...content.states.error, duration: Infinity })
      }
    },
  })

  return (
    <form
      ref={formRef}
      method="post"
      action={actions.contact.queryString}
      onSubmit={handleSubmit}
      onInput={handleInput}
      noValidate
      className="@container flex flex-col gap-6"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />
      <div className="grid @md:grid-cols-2 gap-6">
        {[nameField, emailField].map((field) => (
          <Field
            key={field.name}
            label={field.label}
            name={field.name}
            placeholder={field.placeholder}
            type={field.name === 'email' ? 'email' : 'text'}
            required
            invalid={!!errors[field.name]}
            error={errors[field.name]}
          />
        ))}
      </div>
      {stackedFields.map((field) => (
        <Field
          key={field.name}
          label={field.label}
          name={field.name}
          placeholder={field.placeholder}
          type="text"
          multiline={field.name === 'message'}
          required
          invalid={!!errors[field.name]}
          error={errors[field.name]}
        />
      ))}
      <Button type="submit" loading={isSubmitting} className="self-end">
        {content.submit}
      </Button>
    </form>
  )
}
