'use client'

import { Icon } from '@/components/ui/icon'
import { useOnline } from '@/hooks/use-online'
import { useAppStore } from '@/store/app-store'

function Notice({ children }: { children: string }) {
  return (
    <p
      role="note"
      className="flex items-start justify-center gap-2 border-b border-line bg-paper px-[22px] py-2.5 text-[13px] leading-snug md:px-10"
    >
      <Icon name="info" size={16} className="mt-px shrink-0 text-forest" />
      {children}
    </p>
  )
}

/** Franjas de estado: sin conexión y almacenamiento no disponible. */
export function AppNotices() {
  const online = useOnline()
  const unavailable = useAppStore((s) => s.storageStatus === 'unavailable')
  return (
    <>
      {!online && (
        <Notice>
          Sin conexión. Puedes seguir usando lo que ya cargaste; tus datos están en este
          dispositivo.
        </Notice>
      )}
      {unavailable && (
        <Notice>
          Tu navegador no permite guardar datos: el historial y tus preferencias se perderán al
          recargar o cerrar la pestaña.
        </Notice>
      )}
    </>
  )
}
