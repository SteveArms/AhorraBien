'use client'

import { useTrackNavigation } from '@/hooks/use-back-navigation'

/** Permite a useBackNavigation saber si hay una pantalla anterior dentro de la app. */
export function NavigationTracker() {
  useTrackNavigation()
  return null
}
