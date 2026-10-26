import { useSyncExternalStore } from 'react'
import { useAppStore } from '@/store/app-store'

/** true cuando el store ya leyó localStorage. En el servidor siempre es false. */
export function useHydrated() {
  return useSyncExternalStore(
    (onChange) => useAppStore.persist.onFinishHydration(onChange),
    () => useAppStore.persist.hasHydrated(),
    () => false,
  )
}
