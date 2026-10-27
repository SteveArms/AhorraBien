'use client'

import { useEffect, useRef } from 'react'

/** Fondo inerte, foco en `[data-autofocus]`, Escape cierra y el foco vuelve a quien abrió el modal. */
export function useModal(open: boolean, onClose: () => void) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const background = [...document.body.children].filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && el !== overlayRef.current && !el.inert,
    )
    background.forEach((el) => (el.inert = true))
    overlayRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseRef.current()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      background.forEach((el) => (el.inert = false))
      trigger?.focus()
    }
  }, [open])

  return overlayRef
}
