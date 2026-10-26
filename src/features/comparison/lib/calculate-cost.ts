import { altSchema } from '@/schemas/comparison.schema'
import type { Alt, Comparison, ComparisonOutcome } from '@/types'

const round2 = (value: number) => Math.round(value * 100) / 100

/**
 * Costo real = precio − descuento − beneficio de pago + transporte + otros gastos.
 * El cashback no se resta. Devuelve null si la alternativa no pasa `altSchema`.
 */
export function calculateCost(alt: Alt): number | null {
  if (!altSchema.safeParse(alt).success) return null
  return Math.max(0, round2(alt.price - alt.discount - alt.benefit + alt.transport + alt.extras))
}

/** Compara ambas alternativas. Devuelve null si alguna no se puede calcular. */
export function compareAlternatives(
  comparison: Pick<Comparison, 'a' | 'b'>,
): ComparisonOutcome | null {
  const aCost = calculateCost(comparison.a)
  const bCost = calculateCost(comparison.b)
  if (aCost === null || bCost === null) return null
  return {
    aCost,
    bCost,
    winner: aCost === bCost ? 'tie' : aCost < bCost ? 'a' : 'b',
    difference: round2(Math.abs(aCost - bCost)),
  }
}
