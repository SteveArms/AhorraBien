import type { Alt, Comparison } from '@/types'

export const EXAMPLE_PRODUCT = 'Auriculares inalámbricos'

export const blankAlt = (price: number): Alt => ({
  price,
  discount: 0,
  benefit: 0,
  transport: 0,
  extras: 0,
  cashback: 0,
})

const base = (): Pick<Comparison, 'id' | 'date' | 'product'> => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString(),
  product: EXAMPLE_PRODUCT,
})

/** Borrador por defecto al iniciar una comparación nueva. */
export const initialComparison = (): Comparison => ({
  ...base(),
  a: blankAlt(100),
  b: blankAlt(95),
})

/** Ejemplo de la demo: con descuentos y transporte ya cargados. */
export const exampleComparison = (): Comparison => ({
  ...base(),
  a: { ...blankAlt(100), discount: 10, transport: 4 },
  b: { ...blankAlt(95), benefit: 5, transport: 2 },
})

/** Se muestra la etiqueta "Datos ilustrativos" mientras el producto sea el del ejemplo. */
export const isExampleComparison = (comparison: Pick<Comparison, 'product'>) =>
  comparison.product === EXAMPLE_PRODUCT
