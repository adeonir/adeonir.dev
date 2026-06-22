import { Field as ArkField } from '@ark-ui/react/field'

import { cn } from '~/helpers/classnames'

const fieldClasses =
  'w-full rounded-lg border bg-input/10 px-4 text-body text-foreground transition-[border-color,box-shadow,opacity] placeholder:text-muted-foreground focus-visible:ring-4 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60'

export type FieldProps = {
  label: string
  name: string
  placeholder?: string
  type?: string
  multiline?: boolean
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  error?: string
}

export function Field({
  label,
  name,
  placeholder,
  type = 'text',
  multiline = false,
  disabled,
  required,
  invalid,
  error,
}: FieldProps) {
  return (
    <ArkField.Root
      disabled={disabled}
      required={required}
      invalid={invalid}
      className="flex flex-col gap-2"
    >
      <ArkField.Label className="text-label text-muted-foreground">
        {label}
      </ArkField.Label>
      {multiline ? (
        <ArkField.Textarea
          name={name}
          placeholder={placeholder}
          rows={5}
          className={cn(
            fieldClasses,
            'min-h-32 resize-y py-3',
            invalid
              ? 'border-destructive focus-visible:ring-destructive/30'
              : 'border-input focus:border-primary focus-visible:ring-ring/40',
          )}
        />
      ) : (
        <ArkField.Input
          name={name}
          type={type}
          placeholder={placeholder}
          className={cn(
            fieldClasses,
            'h-11',
            invalid
              ? 'border-destructive focus-visible:ring-destructive/30'
              : 'border-input focus:border-primary focus-visible:ring-ring/40',
          )}
        />
      )}
      {invalid && error && (
        <ArkField.ErrorText className="text-body text-destructive">
          {error}
        </ArkField.ErrorText>
      )}
    </ArkField.Root>
  )
}
