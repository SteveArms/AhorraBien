import { LESSONS, lessonToComparison } from '@/features/learn/lessons'
import type { Comparison } from '@/types'
import { exampleComparison } from './factories'

type ComparisonData = Pick<Comparison, 'product' | 'a' | 'b'>

const fingerprint = ({ product, a, b }: ComparisonData) => JSON.stringify([product, a, b])

let samples: Set<string> | undefined

/** Ejemplo de la demo o de una lección sin modificar: no basta el nombre, deben coincidir los montos. */
export function isIllustrative(comparison: ComparisonData) {
  samples ??= new Set([exampleComparison(), ...LESSONS.map(lessonToComparison)].map(fingerprint))
  return samples.has(fingerprint(comparison))
}
