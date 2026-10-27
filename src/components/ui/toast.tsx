'use client'

import { useAppStore } from '@/store/app-store'
import { Icon } from './icon'

/**
 * Muestra el mensaje de `flash()` del store. Se monta una vez en el layout raíz.
 * La región `status` existe siempre (vacía si no hay mensaje): los lectores de pantalla
 * solo anuncian cambios dentro de una región que ya estaba en la página.
 */
export function Toast() {
  const toast = useAppStore((s) => s.toast)
  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-[95px] left-1/2 z-40 w-max max-w-[calc(100vw-44px)] -translate-x-1/2 lg:bottom-8"
    >
      {toast && (
        <p className="flex animate-toast items-center gap-[7px] rounded-[22px] bg-ink px-[17px] py-[11px] text-[13px] leading-snug text-paper">
          <Icon name={toast.tone === 'info' ? 'info' : 'check'} />
          {toast.message}
        </p>
      )}
    </div>
  )
}
