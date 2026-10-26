import { describe, expect, it } from 'vitest'
import { blankAlt, exampleComparison } from './factories'
import { calculateCost, compareAlternatives } from './calculate-cost'

describe('calculateCost', () => {
  it('resta descuento y beneficio, suma transporte y otros gastos', () => {
    expect(
      calculateCost({ ...blankAlt(100), discount: 10, benefit: 5, transport: 4, extras: 1 }),
    ).toBe(90)
  })

  it('no resta el cashback', () => {
    expect(calculateCost({ ...blankAlt(100), cashback: 30 })).toBe(100)
  })

  it('redondea a 2 decimales', () => {
    expect(calculateCost({ ...blankAlt(0.1), extras: 0.2 })).toBe(0.3)
  })

  it.each([
    ['precio cero', { ...blankAlt(0) }],
    ['precio NaN', { ...blankAlt(NaN) }],
    ['monto negativo', { ...blankAlt(100), transport: -1 }],
    ['campo vacío', { ...blankAlt(100), extras: NaN }],
    ['descuento + beneficio > precio', { ...blankAlt(100), discount: 60, benefit: 41 }],
  ])('devuelve null con %s', (_, alt) => {
    expect(calculateCost(alt)).toBeNull()
  })

  it('acepta descuento + beneficio igual al precio (costo 0 + gastos)', () => {
    expect(calculateCost({ ...blankAlt(50), discount: 50, transport: 3 })).toBe(3)
  })
})

describe('compareAlternatives', () => {
  it('elige la alternativa más barata y calcula la diferencia', () => {
    // Ejemplo de la demo: A = 100 − 10 + 4 = 94; B = 95 − 5 + 2 = 92.
    expect(compareAlternatives(exampleComparison())).toEqual({
      aCost: 94,
      bCost: 92,
      winner: 'b',
      difference: 2,
    })
  })

  it('detecta empate', () => {
    expect(compareAlternatives({ a: blankAlt(10), b: blankAlt(10) })?.winner).toBe('tie')
  })

  it('devuelve null si una alternativa es inválida', () => {
    expect(compareAlternatives({ a: blankAlt(10), b: blankAlt(0) })).toBeNull()
  })
})
