import { Toaster, toaster } from '~/components/islands/toaster'
import { Button } from '~/components/ui/button'

const samples = [
  {
    type: 'success',
    label: 'Success',
    title: 'All good!',
    description: 'The action was completed successfully.',
  },
  {
    type: 'error',
    label: 'Error',
    title: 'Something went wrong',
    description: 'The action could not be completed.',
  },
  {
    type: 'warning',
    label: 'Warning',
    title: 'Heads up',
    description: 'Review the information before continuing.',
  },
  {
    type: 'info',
    label: 'Info',
    title: 'Information',
    description: 'Here goes an informative notice.',
  },
] as const

export function ToastDemo() {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {samples.map(({ type, label, title, description }) => (
          <Button
            key={type}
            onClick={() => toaster[type]({ title, description })}
          >
            {label}
          </Button>
        ))}
      </div>
      <Toaster />
    </>
  )
}
