import { Field as ArkField } from '@ark-ui/react/field'

import { cn } from '~/lib/cn'

const fieldClasses =
  'w-full rounded-lg border border-border bg-transparent px-4 text-body text-foreground transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60'

export type FieldProps = {
  label: string
  name: string
  placeholder?: string
  type?: string
  multiline?: boolean
  disabled?: boolean
  required?: boolean
}

export function Field({
  label,
  name,
  placeholder,
  type = 'text',
  multiline = false,
  disabled,
  required,
}: FieldProps) {
  return (
    <ArkField.Root
      disabled={disabled}
      required={required}
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
          className={cn(fieldClasses, 'min-h-32 resize-y py-3')}
        />
      ) : (
        <ArkField.Input
          name={name}
          type={type}
          placeholder={placeholder}
          className={cn(fieldClasses, 'h-11')}
        />
      )}
    </ArkField.Root>
  )
}
