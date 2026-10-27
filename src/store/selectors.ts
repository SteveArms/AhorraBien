import { compareAlternatives } from '@/features/comparison/lib/calculate-cost'
import { isIllustrative } from '@/features/comparison/lib/illustrative'
import type { AppStore } from './app-store'

/** Suma de las diferencias de las comparaciones guardadas; los ejemplos no cuentan. */
export const selectTotalSavings = ({ saved }: AppStore) =>
  saved
    .filter((item) => !isIllustrative(item))
    .reduce((sum, item) => sum + (compareAlternatives(item)?.difference ?? 0), 0)

/** El borrador actual ya está en el historial. */
export const selectIsDraftSaved = ({ saved, draft }: AppStore) =>
  saved.some((c) => c.id === draft.id)
