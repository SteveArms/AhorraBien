'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppStore } from '@/store/app-store'

type Pending = { href: string; before?: () => void }

/**
 * Navegación que pide confirmar si el borrador tiene cambios sin guardar.
 * Renderiza `<ConfirmDialog {...discardDialog} />` junto al componente que la usa.
 *
 * @param enabled solo protege cuando es true (p. ej. al estar en /comparar).
 */
export function useGuardedNavigation(enabled = true) {
  const router = useRouter()
  const dirty = useAppStore((s) => s.dirty)
  const markClean = useAppStore((s) => s.markClean)
  const [pending, setPending] = useState<Pending | null>(null)

  const go = ({ href, before }: Pending) => {
    before?.()
    router.push(href)
  }

  const navigate = (href: string, before?: () => void) => {
    if (enabled && dirty) setPending({ href, before })
    else go({ href, before })
  }

  const discardDialog = {
    open: pending !== null,
    onCancel: () => setPending(null),
    onConfirm: () => {
      if (!pending) return
      markClean()
      go(pending)
      setPending(null)
    },
  }

  return { navigate, discardDialog }
}
