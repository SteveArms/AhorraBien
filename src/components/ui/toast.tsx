'use client'

import { useAppStore } from '@/store/app-store'
import { Icon } from './icon'

/** Muestra el mensaje de `flash()` del store. Se monta una vez en el layout raíz. */
export function Toast() {
  const toast = useAppStore((s) => s.toast)
  if (!toast) return null
  return (
    <div
      role="status"
      className="fixed bottom-[95px] left-1/2 z-40 flex w-max max-w-[calc(100vw-44px)] -translate-x-1/2 animate-toast items-center gap-[7px] rounded-[22px] bg-ink px-[17px] py-[11px] text-[13px] leading-snug text-paper lg:bottom-8"
    >
      <Icon name={toast.tone === 'info' ? 'info' : 'check'} />
      {toast.message}
    </div>
  )
}
