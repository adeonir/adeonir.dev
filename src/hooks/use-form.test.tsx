// @vitest-environment happy-dom
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useForm } from '~/hooks/use-form'

type Validate = (data: FormData) => Record<string, string> | null
type Submit = (data: FormData) => void | Promise<void>

function TestForm({
  validate,
  onSubmit,
}: {
  validate: Validate
  onSubmit: Submit
}) {
  const { errors, isSubmitting, handleSubmit, handleInput } = useForm({
    validate,
    onSubmit,
  })

  return (
    <form onSubmit={handleSubmit} onInput={handleInput}>
      <input name="name" placeholder="name" />
      <input name="email" placeholder="email" />
      {errors.name ? <span role="alert">{errors.name}</span> : null}
      {errors.email ? <span role="alert">{errors.email}</span> : null}
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  )
}

const requireFields: Validate = (data) => {
  const errors: Record<string, string> = {}
  if (!data.get('name')) errors.name = 'Name is required'
  if (!data.get('email')) errors.email = 'Email is required'
  return Object.keys(errors).length > 0 ? errors : null
}

const formOf = (container: HTMLElement) =>
  container.querySelector('form') as HTMLFormElement

const inputOf = (container: HTMLElement, name: string) =>
  container.querySelector(`input[name="${name}"]`) as HTMLInputElement

afterEach(cleanup)

describe('useForm', () => {
  it('surfaces the corresponding field error on invalid submit', () => {
    const { container, getByText } = render(
      <TestForm validate={requireFields} onSubmit={vi.fn()} />,
    )

    fireEvent.submit(formOf(container))

    expect(getByText('Name is required')).toBeTruthy()
  })

  it('moves focus to the first invalid field on invalid submit', async () => {
    const { container } = render(
      <TestForm validate={requireFields} onSubmit={vi.fn()} />,
    )
    const nameInput = inputOf(container, 'name')

    fireEvent.submit(formOf(container))

    await waitFor(() => expect(document.activeElement).toBe(nameInput))
  })

  it('clears a field error once its value becomes valid on input', () => {
    const { container, getByText, queryByText } = render(
      <TestForm validate={requireFields} onSubmit={vi.fn()} />,
    )

    fireEvent.submit(formOf(container))
    expect(getByText('Name is required')).toBeTruthy()

    fireEvent.input(inputOf(container, 'name'), { target: { value: 'Ada' } })

    expect(queryByText('Name is required')).toBeNull()
    expect(getByText('Email is required')).toBeTruthy()
  })

  it('calls onSubmit with the entered values when all fields are valid', async () => {
    const onSubmit = vi.fn()
    const { container } = render(
      <TestForm validate={requireFields} onSubmit={onSubmit} />,
    )

    fireEvent.change(inputOf(container, 'name'), { target: { value: 'Ada' } })
    fireEvent.change(inputOf(container, 'email'), {
      target: { value: 'ada@example.com' },
    })
    fireEvent.submit(formOf(container))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    const submitted = onSubmit.mock.calls[0][0] as FormData
    expect(submitted.get('name')).toBe('Ada')
    expect(submitted.get('email')).toBe('ada@example.com')
  })

  it('ignores a repeat submit while a submission is in progress', async () => {
    let resolveSubmit: () => void = () => {}
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve
        }),
    )
    const { container } = render(
      <TestForm validate={() => null} onSubmit={onSubmit} />,
    )
    const form = formOf(container)

    fireEvent.submit(form)
    fireEvent.submit(form)

    expect(onSubmit).toHaveBeenCalledTimes(1)

    resolveSubmit()
    await waitFor(() =>
      expect((form.querySelector('button') as HTMLButtonElement).disabled).toBe(
        false,
      ),
    )
  })
})
