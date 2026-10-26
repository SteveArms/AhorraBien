import { useMemo } from 'react'
import { z } from 'zod'
import { altSchema } from '@/schemas/comparison.schema'
import type { Alt, AltField } from '@/types'

export type AltErrors = Partial<Record<AltField, string>>

/** Primer mensaje de error de `altSchema` por cada campo de la alternativa. */
export function getAltErrors(alt: Alt): AltErrors {
  const result = altSchema.safeParse(alt)
  if (result.success) return {}
  const { fieldErrors } = z.flattenError(result.error)
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [field, messages?.[0]]),
  ) as AltErrors
}

export function useAltValidation(alt: Alt) {
  return useMemo(() => getAltErrors(alt), [alt])
}
