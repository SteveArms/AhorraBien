import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Ancho máximo del contenido según el tipo de pantalla. */
export const SCREEN_WIDTHS = {
  narrow: 'max-w-[600px]',
  wide: 'max-w-[1040px]',
  full: '',
} as const

type ScreenProps = {
  children: ReactNode
  className?: string
  size?: keyof typeof SCREEN_WIDTHS
}

/** Contenedor `<main>` de cada pantalla: márgenes, ancho máximo y animación de entrada. */
export function Screen({ children, className, size = 'narrow' }: ScreenProps) {
  return (
    <main
      className={cn(
        'relative mx-auto min-h-dvh w-full animate-enter px-[22px] pt-[max(20px,env(safe-area-inset-top))] pb-[calc(104px+env(safe-area-inset-bottom))] md:px-10 lg:pt-10 lg:pb-16',
        SCREEN_WIDTHS[size],
        className,
      )}
    >
      {children}
    </main>
  )
}

/** Acciones fijadas al fondo en móvil (onboarding). */
export function StickyActions({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-x-[22px] bottom-[max(22px,env(safe-area-inset-bottom))] grid gap-[3px] md:static md:mt-12">
      {children}
    </div>
  )
}
