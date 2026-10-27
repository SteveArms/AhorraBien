import type { StorageValue } from 'zustand/middleware'

export type StorageStatus = 'ok' | 'unavailable' | 'reset'

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

// Síncrono a propósito: compatible con `persist` y legible sin await.
type SyncPersistStorage<S> = {
  getItem: (name: string) => StorageValue<S> | null
  setItem: (name: string, value: StorageValue<S>) => void
  removeItem: (name: string) => void
}

function memoryStorage(): KeyValueStorage {
  const data = new Map<string, string>()
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
}

export function webStorage(get: () => Storage = () => window.localStorage): KeyValueStorage | null {
  try {
    const storage = get()
    const probe = '__ahorrabien__'
    storage.setItem(probe, probe)
    storage.removeItem(probe)
    return storage
  } catch {
    return null
  }
}

/** Storage de `persist` que no rompe la app: usa memoria si no hay localStorage y descarta JSON dañado. */
export function createSafeStorage<S>(resolve: () => KeyValueStorage | null = webStorage) {
  let backend: KeyValueStorage | undefined
  let status: StorageStatus = 'ok'

  const get = () => {
    if (!backend) {
      const storage = resolve()
      if (!storage) status = 'unavailable'
      backend = storage ?? memoryStorage()
    }
    return backend
  }

  const storage: SyncPersistStorage<S> = {
    getItem: (name) => {
      const raw = get().getItem(name)
      if (raw === null) return null
      try {
        return JSON.parse(raw) as StorageValue<S>
      } catch {
        get().removeItem(name)
        status = 'reset'
        return null
      }
    },
    setItem: (name, value) => {
      try {
        get().setItem(name, JSON.stringify(value))
      } catch {
        // Cuota llena: se sigue en memoria sin interrumpir a la persona.
      }
    },
    removeItem: (name) => get().removeItem(name),
  }

  return { storage, getStatus: () => status }
}
