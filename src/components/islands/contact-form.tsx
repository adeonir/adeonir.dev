import { actions } from 'astro:actions'
import { type SubmitEvent, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Field } from '~/components/ui/field'

type FieldCopy = {
  name: string
  label: string
  placeholder: string
}

type FormCopy = {
  fields: FieldCopy[]
  submit: string
  states: {
    success: string
    error: string
  }
}

type ContactFormProps = {
  copy: FormCopy
}

export function ContactForm({ copy }: ContactFormProps) {
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (status === 'submitting') return

    setStatus('submitting')

    const formData = new FormData(event.currentTarget)
    const result = await actions.contact(formData)

    if (result.error) {
      setStatus('error')
    } else {
      setStatus('success')
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex flex-col gap-2 rounded-lg border border-border bg-card p-6"
      >
        <p className="text-pretty text-body text-foreground">
          {copy.states.success}
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
          {copy.states.error}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />
      {copy.fields.map((field) => (
        <Field
          key={field.name}
          label={field.label}
          name={field.name}
          placeholder={field.placeholder}
          type={field.name === 'email' ? 'email' : 'text'}
          multiline={field.name === 'message'}
          required
        />
      ))}
      <Button
        type="submit"
        variant="primary"
        disabled={status === 'submitting'}
        className="w-fit"
      >
        {copy.submit}
      </Button>
    </form>
  )
}
