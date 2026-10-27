'use client'

import { useEffect } from 'react'
import { getStorageStatus, useAppStore } from '@/store/app-store'

/** Carga el estado persistido (localStorage) una vez montado el cliente. */
export function StoreHydrator() {
  useEffect(() => {
    void Promise.resolve(useAppStore.persist.rehydrate()).then(() => {
      const storageStatus = getStorageStatus()
      useAppStore.setState({ storageStatus })
      if (storageStatus === 'reset') {
        useAppStore
          .getState()
          .flash('No pudimos leer tus datos guardados; empezamos de cero.', 'info')
      }
    })
  }, [])
  return null
}
