import { type InputEvent, type SubmitEvent, useState } from 'react'

type FormErrors = Record<string, string>

type UseFormOptions = {
  validate: (formData: FormData) => FormErrors | null
  onSubmit: (formData: FormData) => void | Promise<void>
}

type UseFormReturn = {
  errors: FormErrors
  isSubmitting: boolean
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>
  handleInput: (event: InputEvent<HTMLFormElement>) => void
}

export function useForm({ validate, onSubmit }: UseFormOptions): UseFormReturn {
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) return

    const formData = new FormData(event.currentTarget)
    const fieldErrors = validate(formData)

    if (fieldErrors) {
      setErrors(fieldErrors)

      const form = event.currentTarget
      requestAnimationFrame(() => {
        for (const element of Array.from(form.elements)) {
          const control = element as HTMLElement & { name?: string }
          if (control.name && fieldErrors[control.name]) {
            control.focus()
            break
          }
        }
      })

      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await Promise.resolve(onSubmit(formData))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInput = (event: InputEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement
    const name = target.name
    if (!name || !errors[name]) return

    const fieldErrors = validate(new FormData(event.currentTarget))
    if (fieldErrors?.[name]) return

    setErrors((previous) => {
      if (!previous[name]) return previous
      const next = { ...previous }
      delete next[name]
      return next
    })
  }

  return { errors, isSubmitting, handleSubmit, handleInput }
}
