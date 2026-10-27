'use client'

import { useEffect } from 'react'
import { getStorageStatus, useAppStore } from '@/store/app-store'
import { writeDraftSession } from '@/store/draft-session'

/** Carga el estado persistido (localStorage) una vez montado el cliente. */
export function StoreHydrator() {
  useEffect(() => {
    const unsubscribe = useAppStore.subscribe(({ draft, dirty, trial }, prev) => {
      if (draft !== prev.draft || dirty !== prev.dirty || trial !== prev.trial) {
        writeDraftSession({ draft, dirty, trial })
      }
    })
    void Promise.resolve(useAppStore.persist.rehydrate()).then(() => {
      const storageStatus = getStorageStatus()
      useAppStore.setState({ storageStatus })
      if (storageStatus === 'reset') {
        useAppStore
          .getState()
          .flash('No pudimos leer tus datos guardados; empezamos de cero.', 'info')
      }
    })
    return unsubscribe
  }, [])
  return null
}
