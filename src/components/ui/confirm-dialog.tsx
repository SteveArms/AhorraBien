'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './button'
import { Icon, type IconName } from './icon'

/** Textos de cada diálogo de confirmación de la app. */
export const CONFIRM_PRESETS = {
  deleteOne: {
    icon: 'trash',
    title: '¿Eliminar esta comparación?',
    description: 'Se quitará de tu historial y no podrás recuperarla',
    cancelLabel: 'Cancelar',
    confirmLabel: 'Eliminar comparación',
  },
  deleteAll: {
    icon: 'trash',
    title: '¿Borrar todo el historial?',
    description:
      'Se eliminarán todas las comparaciones guardadas. Esta acción no se puede deshacer',
    cancelLabel: 'Conservar historial',
    confirmLabel: 'Borrar historial',
  },
  discard: {
    icon: 'info',
    title: '¿Descartar los cambios?',
    description: 'Los ajustes que hiciste no se guardarán.',
    cancelLabel: 'Seguir editando',
    confirmLabel: 'Descartar cambios',
  },
} satisfies Record<string, { icon: IconName } & Record<string, string>>

export type ConfirmPreset = keyof typeof CONFIRM_PRESETS

type ConfirmDialogProps = {
  preset: ConfirmPreset
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

/**
 * Modal para confirmar acciones destructivas: hoja inferior en móvil, centrado desde tablet.
 * Se monta en <body> con un portal: dentro de <Screen> quedaría bajo la barra inferior
 * porque la animación de entrada crea un contexto de apilamiento.
 */
export function ConfirmDialog({ preset, open, onCancel, onConfirm }: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null
  const { icon, title, description, cancelLabel, confirmLabel } = CONFIRM_PRESETS[preset]

  return createPortal(
    <div
      role="presentation"
      onMouseDown={onCancel}
      className="fixed inset-0 z-30 flex animate-fade items-end justify-center bg-ink/55 md:items-center md:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-[430px] animate-sheet rounded-t-sheet bg-paper px-[22px] pt-7 pb-[max(24px,env(safe-area-inset-bottom))] md:max-w-[480px] md:rounded-sheet md:px-7 md:pb-7"
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar"
          className="absolute top-[18px] right-[18px] border-0 bg-transparent"
        >
          <Icon name="close" />
        </button>
        <div className="grid size-11 place-items-center rounded-full bg-danger-soft text-danger">
          <Icon name={icon} />
        </div>
        <h2 id="confirm-title" className="mt-5 mb-2 text-[27px] font-bold tracking-[-.04em]">
          {title}
        </h2>
        <p className="leading-normal text-muted">{description}</p>
        <div className="mt-6 grid grid-cols-[1fr_1.3fr] gap-2.5">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
