'use client'

import { usePathname } from 'next/navigation'
import { BOTTOM_NAV_PATHS, BottomNav } from './bottom-nav'

/** Barra inferior en móvil (solo en BOTTOM_NAV_PATHS); barra superior desde `lg`. */
export function BottomNavSlot() {
  const pathname = usePathname()
  return <BottomNav showOnMobile={BOTTOM_NAV_PATHS.includes(pathname)} />
}
