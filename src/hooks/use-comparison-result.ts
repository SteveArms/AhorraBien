import { useMemo } from 'react'
import { compareAlternatives } from '@/features/comparison/lib/calculate-cost'
import { productSchema } from '@/schemas/comparison.schema'
import type { Comparison } from '@/types'

/** Resultado de la comparación; `outcome` es null si no se puede calcular o falta el producto. */
export function useComparisonResult(comparison: Comparison) {
  return useMemo(() => {
    const outcome = compareAlternatives(comparison)
    const valid = outcome !== null && productSchema.safeParse(comparison.product).success
    return { outcome: valid ? outcome : null }
  }, [comparison])
}
