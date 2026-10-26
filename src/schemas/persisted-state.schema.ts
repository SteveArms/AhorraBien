import { z } from 'zod'
import { comparisonSchema } from './comparison.schema'
import { preferencesSchema } from './preferences.schema'

/** Forma de lo que el store guarda en localStorage. Se valida al rehidratar. */
export const persistedStateSchema = preferencesSchema.extend({
  saved: z.array(comparisonSchema),
})
