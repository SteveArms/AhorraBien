import { ButtonLink } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Screen } from '@/components/layout/screen'

export default function NotFound() {
  return (
    <Screen>
      <EmptyState
        decorated
        className="pt-[85px]"
        title="No encontramos esta página"
        description="Puede que el enlace esté mal escrito o que la pantalla ya no exista."
        action={<ButtonLink href="/inicio">Ir al inicio</ButtonLink>}
      />
    </Screen>
  )
}
