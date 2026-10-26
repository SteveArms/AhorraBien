import type { z } from 'zod'
import type { altKeySchema, altSchema, comparisonSchema } from '@/schemas/comparison.schema'
import type { persistedStateSchema } from '@/schemas/persisted-state.schema'
import type { preferencesSchema } from '@/schemas/preferences.schema'

export type Alt = z.infer<typeof altSchema>
export type AltField = keyof Alt
export type AltKey = z.infer<typeof altKeySchema>
export type Comparison = z.infer<typeof comparisonSchema>
export type Preferences = z.infer<typeof preferencesSchema>
export type PersistedState = z.infer<typeof persistedStateSchema>

export type Winner = AltKey | 'tie'
export type ComparisonOutcome = {
  aCost: number
  bCost: number
  winner: Winner
  difference: number
}
