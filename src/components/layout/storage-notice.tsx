'use client'

import { Icon } from '@/components/ui/icon'
import { useAppStore } from '@/store/app-store'

export function StorageNotice() {
  const unavailable = useAppStore((s) => s.storageStatus === 'unavailable')
  if (!unavailable) return null
  return (
    <p
      role="note"
      className="flex items-start justify-center gap-2 border-b border-line bg-paper px-[22px] py-2.5 text-[13px] leading-snug md:px-10"
    >
      <Icon name="info" size={16} className="mt-px shrink-0 text-forest" />
      Tu navegador no permite guardar datos: el historial y tus preferencias se perderán al recargar
      o cerrar la pestaña.
    </p>
  )
}
