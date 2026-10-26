import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Contenedor `<main>` de cada pantalla: márgenes, espacio para la barra inferior y animación de entrada. */
export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main
      className={cn(
        'min-h-dvh animate-enter px-[22px] pt-[max(20px,env(safe-area-inset-top))] pb-[calc(104px+env(safe-area-inset-bottom))]',
        className,
      )}
    >
      {children}
    </main>
  )
}

/** Acciones fijadas al fondo de la pantalla (onboarding). */
export function StickyActions({ children }: { children: ReactNode }) {
  return (
    <div className="absolute right-[22px] bottom-[max(22px,env(safe-area-inset-bottom))] left-[22px] grid gap-[3px]">
      {children}
    </div>
  )
}
