'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Cantidad de pantallas visitadas en esta sesión sin recargar la página.
let visitedScreens = 0
let lastPath: string | null = null

/** Registra cada cambio de ruta. Se monta una vez en el layout raíz (<NavigationTracker />). */
export function useTrackNavigation() {
  const pathname = usePathname()
  useEffect(() => {
    visitedScreens += 1
    lastPath = pathname
  }, [pathname])
}

/** Ruta anterior o null; se lee antes de que el tracker registre la actual. */
export function usePreviousPath() {
  const pathname = usePathname()
  const [previous] = useState(() => (lastPath !== pathname ? lastPath : null))
  return previous
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
