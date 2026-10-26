'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Cantidad de pantallas visitadas en esta sesión sin recargar la página.
let visitedScreens = 0

/** Registra cada cambio de ruta. Se monta una vez en el layout raíz (<NavigationTracker />). */
export function useTrackNavigation() {
  const pathname = usePathname()
  useEffect(() => {
    visitedScreens += 1
  }, [pathname])
}

/**
 * Vuelve a la pantalla anterior si se llegó navegando dentro de la app;
 * si la pantalla se abrió directamente (enlace o recarga), va a `fallback`.
 */
export function useBackNavigation(fallback: string) {
  const router = useRouter()
  return () => {
    if (visitedScreens > 1) router.back()
    else router.push(fallback)
  }
}
