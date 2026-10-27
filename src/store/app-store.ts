import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { exampleComparison, initialComparison } from '@/features/comparison/lib/factories'
import { persistedStateSchema } from '@/schemas/persisted-state.schema'
import type { Alt, AltField, AltKey, Comparison, PersistedState } from '@/types'
import { readDraftSession } from './draft-session'
import { createSafeStorage, type StorageStatus } from './safe-storage'

export const STORAGE_KEY = 'ahorrabien:v1'
const TOAST_MS = 2200
const safeStorage = createSafeStorage<PersistedState>()
export const getStorageStatus = safeStorage.getStatus

export type ToastTone = 'success' | 'info'

type AppState = PersistedState & {
  /** Comparación en edición o en pantalla de resultado. No se persiste. */
  draft: Comparison
  /** Hay cambios en el borrador que no se guardaron en el historial. */
  dirty: boolean
  toast: { message: string; tone: ToastTone } | null
  storageStatus: StorageStatus
}

type AppActions = {
  setGoal: (goal: string) => void
  toggleDifficulty: (difficulty: string) => void
  startNew: () => void
  loadExample: () => void
  /** Carga una comparación ya armada (p. ej. el ejemplo de una lección) como borrador limpio. */
  loadDraft: (comparison: Comparison) => void
  openSaved: (id: string) => void
  setProduct: (product: string) => void
  setAltField: (key: AltKey, field: AltField, value: number) => void
  setAlt: (key: AltKey, alt: Alt) => void
  markClean: () => void
  save: () => void
  removeCurrent: () => void
  clearHistory: () => void
  /** Borra objetivo, dificultades, historial y borrador: la app queda como recién instalada. */
  resetAll: () => void
  flash: (message: string, tone?: ToastTone) => void
}

export type AppStore = AppState & AppActions

let toastTimer: ReturnType<typeof setTimeout> | undefined

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      goal: '',
      difficulties: [],
      saved: [],
      draft: initialComparison(),
      dirty: false,
      toast: null,
      storageStatus: 'ok',

      setGoal: (goal) => set({ goal }),
      toggleDifficulty: (difficulty) =>
        set(({ difficulties }) => ({
          difficulties: difficulties.includes(difficulty)
            ? difficulties.filter((d) => d !== difficulty)
            : [...difficulties, difficulty],
        })),

      startNew: () => set({ draft: initialComparison(), dirty: false }),
      loadExample: () => set({ draft: exampleComparison(), dirty: false }),
      loadDraft: (comparison) => set({ draft: comparison, dirty: false }),
      openSaved: (id) => {
        const item = get().saved.find((c) => c.id === id)
        if (item) set({ draft: item, dirty: false })
      },
      setProduct: (product) => set(({ draft }) => ({ draft: { ...draft, product }, dirty: true })),
      setAltField: (key, field, value) =>
        set(({ draft }) => ({
          draft: { ...draft, [key]: { ...draft[key], [field]: value } },
          dirty: true,
        })),
      setAlt: (key, alt) => set(({ draft }) => ({ draft: { ...draft, [key]: alt }, dirty: true })),
      markClean: () => set({ dirty: false }),

      save: () => {
        const next = { ...get().draft, date: new Date().toISOString() }
        set(({ saved }) => ({
          draft: next,
          saved: [next, ...saved.filter((c) => c.id !== next.id)],
          dirty: false,
        }))
        get().flash('Comparación guardada')
      },
      removeCurrent: () =>
        set(({ saved, draft }) => ({ saved: saved.filter((c) => c.id !== draft.id) })),
      clearHistory: () => set({ saved: [] }),
      resetAll: () =>
        set({ goal: '', difficulties: [], saved: [], draft: initialComparison(), dirty: false }),

      flash: (message, tone = 'success') => {
        clearTimeout(toastTimer)
        set({ toast: { message, tone } })
        toastTimer = setTimeout(() => set({ toast: null }), TOAST_MS)
      },
    }),
    {
      name: STORAGE_KEY,
      storage: safeStorage.storage,
      // La hidratación la dispara <StoreHydrator /> en el cliente para evitar desajustes con SSR.
      skipHydration: true,
      partialize: ({ goal, difficulties, saved }): PersistedState => ({
        goal,
        difficulties,
        saved,
      }),
      // Datos corruptos o de otra versión no deben romper la app: se ignoran.
      // El borrador de la pestaña se restaura aquí para llegar junto al historial, en una sola escritura.
      merge: (persisted, current) => {
        const parsed = persistedStateSchema.safeParse(persisted)
        return { ...current, ...(parsed.success ? parsed.data : {}), ...readDraftSession() }
      },
    },
  ),
)
