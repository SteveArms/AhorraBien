import type { ReactNode } from 'react'
import { HydrationGate } from '@/components/layout/hydration-gate'
import { StorageNotice } from '@/components/layout/storage-notice'

/** Onboarding y demo: leen preferencias persistidas, por eso esperan la hidratación. */
export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <HydrationGate>
      <StorageNotice />
      {children}
    </HydrationGate>
  )
}
