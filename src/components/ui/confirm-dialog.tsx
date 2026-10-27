'use client'

import { useEffect, useId, useRef } from 'react'
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
  const overlayRef = useRef<HTMLDivElement>(null)
  const onCancelRef = useRef(onCancel)
  const id = useId()

  useEffect(() => {
    onCancelRef.current = onCancel
  })

  // Fondo inerte y foco en Cancelar; al cerrar, el foco vuelve a quien lo abrió.
  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const background = [...document.body.children].filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && el !== overlayRef.current && !el.inert,
    )
    background.forEach((el) => (el.inert = true))
    overlayRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancelRef.current()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      background.forEach((el) => (el.inert = false))
      trigger?.focus()
    }
  }, [open])

  if (!open) return null
  const { icon, title, description, cancelLabel, confirmLabel } = CONFIRM_PRESETS[preset]

  return createPortal(
    <div
      ref={overlayRef}
      role="presentation"
      onMouseDown={onCancel}
      className="fixed inset-0 z-30 flex animate-fade items-end justify-center bg-ink/55 md:items-center md:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-[430px] animate-sheet rounded-t-sheet bg-paper px-[22px] pt-7 pb-[max(24px,env(safe-area-inset-bottom))] md:max-w-[480px] md:rounded-sheet md:px-7 md:pb-7"
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar"
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full border-0 bg-transparent transition-colors duration-150 hover:bg-cream"
        >
          <Icon name="close" />
        </button>
        <div className="grid size-11 place-items-center rounded-full bg-danger-soft text-danger">
          <Icon name={icon} />
        </div>
        <h2 id={`${id}-title`} className="mt-5 mb-2 text-[27px] font-bold tracking-[-.04em]">
          {title}
        </h2>
        <p id={`${id}-description`} className="leading-normal text-muted">
          {description}
        </p>
        <div className="mt-6 grid grid-cols-[1fr_1.3fr] gap-2.5">
          <Button variant="secondary" onClick={onCancel} data-autofocus>
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
