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

const base = (product: string): Pick<Comparison, 'id' | 'date' | 'product'> => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString(),
  product,
})

/**
 * Borrador por defecto al iniciar una comparación nueva: vacío, para que ningún monto
 * inventado pase por un resultado real. Los precios vacíos (NaN) los marca la validación.
 */
export const initialComparison = (): Comparison => ({
  ...base(''),
  a: blankAlt(NaN),
  b: blankAlt(NaN),
})

/** Ejemplo de la demo: con descuentos y transporte ya cargados. */
export const exampleComparison = (): Comparison => ({
  ...base(EXAMPLE_PRODUCT),
  a: { ...blankAlt(100), discount: 10, transport: 4 },
  b: { ...blankAlt(95), benefit: 5, transport: 2 },
})
