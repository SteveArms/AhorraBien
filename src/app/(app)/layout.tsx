import type { ReactNode } from 'react'
import { BottomNavSlot } from '@/components/layout/bottom-nav-slot'
import { HydrationGate } from '@/components/layout/hydration-gate'
import { AppNotices } from '@/components/layout/app-notices'

/** Pantallas principales: esperan la hidratación del store y muestran la navegación principal. */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <HydrationGate>
      {/* Hueco para la barra superior (64px) desde `lg`. */}
      <div className="lg:pt-16">
        <AppNotices />
        {children}
      </div>
      <BottomNavSlot />
    </HydrationGate>
  )
}
