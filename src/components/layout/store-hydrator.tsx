'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/app-store'

/** Carga el estado persistido (localStorage) una vez montado el cliente. */
export function StoreHydrator() {
  useEffect(() => {
    void useAppStore.persist.rehydrate()
  }, [])
  return null
}
