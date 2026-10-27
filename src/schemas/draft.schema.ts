import { z } from 'zod'

// JSON guarda NaN (campo vacío) como null: se recupera como NaN para que la validación lo marque.
const amount = z
  .number()
  .nullable()
  .transform((value) => value ?? NaN)

const draftAlt = z.object({
  price: amount,
  discount: amount,
  benefit: amount,
  transport: amount,
  extras: amount,
  cashback: amount,
})

/** Borrador en edición guardado en la pestaña: solo se exige la forma, no que sea válido. */
export const draftSessionSchema = z.object({
  draft: z.object({
    id: z.string().min(1),
    date: z.string(),
    product: z.string(),
    a: draftAlt,
    b: draftAlt,
  }),
  dirty: z.boolean(),
  // Ausente en borradores guardados antes de existir el campo.
  trial: z.boolean().default(false),
})
