import { Portal } from '@ark-ui/react/portal'
import { Toaster as ArkToaster, createToaster } from '@ark-ui/react/toast'

import { Toast } from '~/components/ui/toast'

export const toaster = createToaster({
  placement: 'bottom-end',
  duration: 5000,
  overlap: false,
  gap: 16,
  max: 3,
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
            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
            {toast.description && (
              <Toast.Description>{toast.description}</Toast.Description>
            )}
            <Toast.CloseTrigger />
          </Toast.Root>
        )}
      </ArkToaster>
    </Portal>
  )
}
