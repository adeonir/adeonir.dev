import { Toaster, toaster } from '~/components/islands/toaster'
import { Button } from '~/components/ui/button'

const samples = [
  {
    type: 'success',
    label: 'Success',
    title: 'Tudo certo!',
    description: 'A ação foi concluída com sucesso.',
  },
  {
    type: 'error',
    label: 'Error',
    title: 'Algo deu errado',
    description: 'Não foi possível concluir a ação.',
  },
  {
    type: 'warning',
    label: 'Warning',
    title: 'Atenção',
    description: 'Revise as informações antes de continuar.',
  },
  {
    type: 'info',
    label: 'Info',
    title: 'Informação',
    description: 'Aqui vai um aviso informativo.',
  },
] as const

export function ToastDemo() {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption text-muted-foreground">Toast</span>
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
    </div>
  )
}
