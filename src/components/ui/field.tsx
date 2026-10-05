import { Field as ArkField } from '@ark-ui/react/field'

import { cn } from '~/helpers/classnames'
import IconAlertCircle from '~icons/tabler/alert-circle'

const fieldClasses =
  'w-full rounded-lg border px-4 text-body text-foreground transition-[border-color,background-color,opacity] placeholder:text-muted-foreground focus:border-primary focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60'

const validClasses =
  'border-input bg-input/10 not-focus:enabled:hover:bg-input/20'

const invalidClasses =
  'border-destructive bg-destructive/5 not-focus:enabled:hover:bg-destructive/10 focus:bg-input/10'

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
  autoComplete?: string
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
  autoComplete,
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
          autoComplete={autoComplete}
          placeholder={placeholder}
          rows={5}
          className={cn(
            fieldClasses,
            'min-h-32 resize-y py-3',
            invalid ? invalidClasses : validClasses,
          )}
        />
      ) : (
        <ArkField.Input
          name={name}
          autoComplete={autoComplete}
          type={type}
          placeholder={placeholder}
          className={cn(
            fieldClasses,
            'h-11',
            invalid ? invalidClasses : validClasses,
          )}
        />
      )}
      {invalid && error && (
        <ArkField.ErrorText className="flex items-start gap-1.5 text-caption text-destructive">
          <IconAlertCircle className="mt-px size-4 shrink-0" />
          {error}
        </ArkField.ErrorText>
      )}
    </ArkField.Root>
  )
}
