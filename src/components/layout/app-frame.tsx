import type { ReactNode } from 'react'

/** Contenedor raíz a todo el ancho. */
export function AppFrame({ children }: { children: ReactNode }) {
  // `clip` en vez de `hidden` para no romper `position: sticky`.
  return <div className="relative min-h-dvh overflow-x-clip bg-cream">{children}</div>
}
