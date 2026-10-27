'use client'

import { useEffect } from 'react'
import { Button, ButtonLink } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Screen } from '@/components/layout/screen'

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Screen>
      <EmptyState
        decorated
        className="pt-[85px]"
        title="Algo salió mal"
        description="No pudimos mostrar esta pantalla. Intenta de nuevo o vuelve al inicio; tus comparaciones guardadas siguen a salvo."
        action={
          <div className="mt-3 grid justify-items-center gap-1">
            <Button onClick={retry}>Reintentar</Button>
            <ButtonLink href="/inicio" variant="text">
              Volver al inicio
            </ButtonLink>
          </div>
        }
      />
    </Screen>
  )
}
