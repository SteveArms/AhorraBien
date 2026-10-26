import { z } from 'zod'

export const preferencesSchema = z.object({
  goal: z.string(),
  difficulties: z.array(z.string()),
})
