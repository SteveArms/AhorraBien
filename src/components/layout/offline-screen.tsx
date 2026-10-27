'use client'

import { useId } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useModal } from '@/hooks/use-modal'

type OfflineScreenProps = {
  open: boolean
  onStay: () => void
  onRetry: () => void
  onHome: () => void
}

export function OfflineScreen({ open, onStay, onRetry, onHome }: OfflineScreenProps) {
  const overlayRef = useModal(open, onStay)
  const id = useId()
  if (!open) return null

  return createPortal(
    <div
      ref={overlayRef}
      role="presentation"
      className="fixed inset-0 z-40 grid animate-fade place-items-center bg-cream px-[22px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        className="grid w-full max-w-[430px] justify-items-center gap-3 text-center"
      >
        <span className="grid size-14 place-items-center rounded-full bg-sage text-forest">
          <Icon name="info" size={26} />
        </span>
        <h2 id={`${id}-title`} className="mt-2 text-[27px] font-bold tracking-[-.04em]">
          Sin conexión
        </h2>
        <p id={`${id}-description`} className="leading-normal text-muted">
          No pudimos abrir esa pantalla porque no hay internet. Tus comparaciones están a salvo en
          este dispositivo.
        </p>
        <div className="mt-4 grid w-full gap-2.5">
          <Button onClick={onRetry}>Reintentar</Button>
          <Button variant="secondary" onClick={onHome}>
            Ir al inicio
          </Button>
          <Button variant="text" onClick={onStay} data-autofocus>
            Seguir en esta pantalla
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
