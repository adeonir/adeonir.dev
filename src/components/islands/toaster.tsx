import { Portal } from '@ark-ui/react/portal'
import { Toaster as ArkToaster, createToaster } from '@ark-ui/react/toast'

import { Toast } from '~/components/ui/toast'

export const toaster = createToaster({
  placement: 'bottom-end',
  duration: 5000,
  overlap: true,
  gap: 16,
  max: 4,
})

export function Toaster() {
  return (
    <Portal>
      <ArkToaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            key={toast.id}
            aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
          >
            <Toast.Indicator type={toast.type} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </div>
            <Toast.CloseTrigger />
          </Toast.Root>
        )}
      </ArkToaster>
    </Portal>
  )
}
