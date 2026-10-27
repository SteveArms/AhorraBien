import type { PersistStorage, StorageValue } from 'zustand/middleware'

export type StorageStatus = 'ok' | 'unavailable' | 'reset'

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function memoryStorage(): KeyValueStorage {
  const data = new Map<string, string>()
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
}

function browserStorage(): KeyValueStorage | null {
  try {
    const storage = window.localStorage
    const probe = '__ahorrabien__'
    storage.setItem(probe, probe)
    storage.removeItem(probe)
    return storage
  } catch {
    return null
  }
}

/** Storage de `persist` que no rompe la app: usa memoria si no hay localStorage y descarta JSON dañado. */
export function createSafeStorage<S>(resolve: () => KeyValueStorage | null = browserStorage) {
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

  const storage: PersistStorage<S> = {
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
