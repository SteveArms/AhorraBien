import { compareAlternatives } from '@/features/comparison/lib/calculate-cost'
import type { AppStore } from './app-store'

/** Suma de las diferencias de todas las comparaciones guardadas. */
export const selectTotalSavings = ({ saved }: AppStore) =>
  saved.reduce((sum, item) => sum + (compareAlternatives(item)?.difference ?? 0), 0)

/** El borrador actual ya está en el historial. */
export const selectIsDraftSaved = ({ saved, draft }: AppStore) =>
  saved.some((c) => c.id === draft.id)
