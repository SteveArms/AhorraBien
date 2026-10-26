import { z } from 'zod'

export const ALT_KEYS = ['a', 'b'] as const
export const altKeySchema = z.enum(ALT_KEYS)

export const MESSAGES = {
  price: 'Ingresa un precio mayor que cero.',
  amount: 'Ingresa un monto (usa 0 si no aplica).',
  negative: 'El monto no puede ser negativo.',
  overDiscount: 'Descuentos y beneficios superan el precio.',
  product: 'Ingresa el nombre del producto.',
} as const

// z.number() rechaza NaN e Infinity, así que un input vacío (NaN) es inválido.
const amount = z.number({ error: MESSAGES.amount }).min(0, MESSAGES.negative)

const altShape = z.object({
  price: z.number({ error: MESSAGES.price }).gt(0, MESSAGES.price),
  discount: amount,
  benefit: amount,
  transport: amount,
  extras: amount,
  /** Referencial: se muestra aparte y no reduce el costo final. */
  cashback: amount,
})

const priceAndReductions = altShape.pick({ price: true, discount: true, benefit: true })

export const altSchema = altShape.refine((alt) => alt.discount + alt.benefit <= alt.price, {
  message: MESSAGES.overDiscount,
  path: ['benefit'],
  // Se evalúa aunque otros campos (transporte, extras…) sean inválidos.
  when: (payload) => priceAndReductions.safeParse(payload.value).success,
})

export const productSchema = z.string().trim().min(1, MESSAGES.product)

export const comparisonSchema = z.object({
  id: z.string().min(1),
  date: z.iso.datetime(),
  product: productSchema,
  a: altSchema,
  b: altSchema,
})
