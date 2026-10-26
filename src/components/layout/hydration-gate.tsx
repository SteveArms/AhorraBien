'use client'

import type { ReactNode } from 'react'
import { useHydrated } from '@/hooks/use-hydrated'

/** No renderiza a sus hijos hasta que el store haya leído localStorage. */
export function HydrationGate({ children }: { children: ReactNode }) {
  return useHydrated() ? children : null
}
