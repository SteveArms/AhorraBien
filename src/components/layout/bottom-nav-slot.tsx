'use client'

import { usePathname } from 'next/navigation'
import { BOTTOM_NAV_PATHS, BottomNav } from './bottom-nav'

/** Muestra la barra inferior solo en las rutas de BOTTOM_NAV_PATHS. */
export function BottomNavSlot() {
  const pathname = usePathname()
  return BOTTOM_NAV_PATHS.includes(pathname) ? <BottomNav /> : null
}
