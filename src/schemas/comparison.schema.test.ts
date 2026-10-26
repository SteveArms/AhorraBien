import { describe, expect, it } from 'vitest'
import { blankAlt } from '@/features/comparison/lib/factories'
import { getAltErrors } from '@/hooks/use-alt-validation'
import { MESSAGES, altKeySchema, productSchema } from './comparison.schema'

describe('altSchema (vía getAltErrors)', () => {
  it('sin errores para una alternativa válida', () => {
    expect(getAltErrors(blankAlt(10))).toEqual({})
  })

  it('marca el precio si es cero o vacío', () => {
    expect(getAltErrors(blankAlt(0)).price).toBe(MESSAGES.price)
    expect(getAltErrors(blankAlt(NaN)).price).toBe(MESSAGES.price)
  })

  it('marca montos vacíos y negativos', () => {
    const errors = getAltErrors({ ...blankAlt(10), transport: NaN, extras: -2 })
    expect(errors.transport).toBe(MESSAGES.amount)
    expect(errors.extras).toBe(MESSAGES.negative)
  })

  it('marca el beneficio cuando descuento + beneficio superan el precio', () => {
    expect(getAltErrors({ ...blankAlt(10), discount: 6, benefit: 5 }).benefit).toBe(
      MESSAGES.overDiscount,
    )
  })

  it('valida la suma de descuentos aunque otro campo sea inválido', () => {
    const errors = getAltErrors({ ...blankAlt(10), discount: 6, benefit: 5, extras: NaN })
    expect(errors.benefit).toBe(MESSAGES.overDiscount)
    expect(errors.extras).toBe(MESSAGES.amount)
  })
})

describe('productSchema / altKeySchema', () => {
  it('rechaza nombre de producto vacío o solo espacios', () => {
    expect(productSchema.safeParse('   ').success).toBe(false)
    expect(productSchema.safeParse('Zapatillas').success).toBe(true)
  })

  it('solo acepta las alternativas a y b', () => {
    expect(altKeySchema.safeParse('a').success).toBe(true)
    expect(altKeySchema.safeParse('c').success).toBe(false)
  })
})
