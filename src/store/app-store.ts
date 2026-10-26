import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { exampleComparison, initialComparison } from '@/features/comparison/lib/factories'
import { persistedStateSchema } from '@/schemas/persisted-state.schema'
import type { Alt, AltField, AltKey, Comparison, PersistedState } from '@/types'

export const STORAGE_KEY = 'ahorrabien:v1'
const TOAST_MS = 2200

type AppState = PersistedState & {
  /** Comparación en edición o en pantalla de resultado. No se persiste. */
  draft: Comparison
  /** Hay cambios en el borrador que no se guardaron en el historial. */
  dirty: boolean
  toast: string | null
}

type AppActions = {
  setGoal: (goal: string) => void
  toggleDifficulty: (difficulty: string) => void
  startNew: () => void
  loadExample: () => void
  openSaved: (id: string) => void
  setProduct: (product: string) => void
  setAltField: (key: AltKey, field: AltField, value: number) => void
  setAlt: (key: AltKey, alt: Alt) => void
  markClean: () => void
  save: () => void
  removeCurrent: () => void
  clearHistory: () => void
  flash: (message: string) => void
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

      setGoal: (goal) => set({ goal }),
      toggleDifficulty: (difficulty) =>
        set(({ difficulties }) => ({
          difficulties: difficulties.includes(difficulty)
            ? difficulties.filter((d) => d !== difficulty)
            : [...difficulties, difficulty],
        })),

      startNew: () => set({ draft: initialComparison(), dirty: false }),
      loadExample: () => set({ draft: exampleComparison(), dirty: false }),
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

      flash: (message) => {
        clearTimeout(toastTimer)
        set({ toast: message })
        toastTimer = setTimeout(() => set({ toast: null }), TOAST_MS)
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // La hidratación la dispara <StoreHydrator /> en el cliente para evitar desajustes con SSR.
      skipHydration: true,
      partialize: ({ goal, difficulties, saved }): PersistedState => ({
        goal,
        difficulties,
        saved,
      }),
      // Datos corruptos o de otra versión no deben romper la app: se ignoran.
      merge: (persisted, current) => {
        const parsed = persistedStateSchema.safeParse(persisted)
        return parsed.success ? { ...current, ...parsed.data } : current
      },
    },
  ),
)
