import type { ReactNode } from 'react'
import { BottomNavSlot } from '@/components/layout/bottom-nav-slot'
import { HydrationGate } from '@/components/layout/hydration-gate'

/** Pantallas principales: esperan la hidratación del store y muestran la barra inferior. */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <HydrationGate>
      {children}
      <BottomNavSlot />
    </HydrationGate>
  )
}
