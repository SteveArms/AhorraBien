import { describe, expect, it } from 'vitest'
import { createSafeStorage } from './safe-storage'

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  }
}

describe('createSafeStorage', () => {
  it('lee y escribe JSON válido', () => {
    const backend = fakeStorage()
    const { storage, getStatus } = createSafeStorage<{ n: number }>(() => backend)
    storage.setItem('k', { state: { n: 1 }, version: 0 })
    expect(storage.getItem('k')).toEqual({ state: { n: 1 }, version: 0 })
    expect(getStatus()).toBe('ok')
  })

  it('descarta el JSON dañado y avisa con el estado "reset"', () => {
    const backend = fakeStorage({ k: '{roto' })
    const { storage, getStatus } = createSafeStorage(() => backend)
    expect(storage.getItem('k')).toBeNull()
    expect(backend.data.has('k')).toBe(false)
    expect(getStatus()).toBe('reset')
  })

  it('sin localStorage funciona en memoria y avisa con "unavailable"', () => {
    const { storage, getStatus } = createSafeStorage<{ n: number }>(() => null)
    storage.setItem('k', { state: { n: 2 }, version: 0 })
    expect(storage.getItem('k')).toEqual({ state: { n: 2 }, version: 0 })
    expect(getStatus()).toBe('unavailable')
  })

  it('no lanza si la escritura falla (cuota llena)', () => {
    const backend = {
      ...fakeStorage(),
      setItem: () => {
        throw new DOMException('lleno', 'QuotaExceededError')
      },
    }
    const { storage } = createSafeStorage(() => backend)
    expect(() => storage.setItem('k', { state: {}, version: 0 })).not.toThrow()
  })
})
