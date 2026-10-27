import { describe, expect, it } from 'vitest'
import { detectIllusions } from './detect-illusions'
import { blankAlt, exampleComparison } from './factories'

const ids = (...args: Parameters<typeof detectIllusions>) =>
  detectIllusions(...args).map((i) => i.id)

describe('detectIllusions', () => {
  it('avisa cuando la alternativa con más descuento pierde (ejemplo de la demo)', () => {
    expect(ids(exampleComparison())).toEqual(['discount-trap'])
  })

  it('avisa cuando transporte y gastos igualan o superan el descuento', () => {
    const a = { ...blankAlt(100), discount: 10, transport: 12 }
    expect(ids({ a, b: blankAlt(100) })).toEqual(['discount-trap', 'costs-eat-discount'])
  })

  it('avisa cuando la etiqueta más baja termina siendo la más cara', () => {
    const a = { ...blankAlt(90), transport: 15 }
    const [illusion] = detectIllusions({ a, b: blankAlt(100) })
    expect(illusion).toMatchObject({ id: 'sticker-price', topic: 'transport' })
  })

  it('explica el cashback y dice si cambiaría el ganador', () => {
    const flips = detectIllusions({ a: { ...blankAlt(100), cashback: 20 }, b: blankAlt(95) })
    expect(flips[0].title).toMatch(/cambiaría el ganador/)
    const winnerHasIt = detectIllusions({ a: blankAlt(100), b: { ...blankAlt(95), cashback: 5 } })
    expect(winnerHasIt[0].title).toBe('El cashback no se resta')
  })

  it('pone primero las alertas de los temas que más le cuestan al usuario', () => {
    const a = { ...blankAlt(100), discount: 10, transport: 12 }
    expect(ids({ a, b: blankAlt(100) }, { transport: 2 })).toEqual([
      'costs-eat-discount',
      'discount-trap',
    ])
  })

  it('no devuelve alertas en un empate sin trampas ni con datos inválidos', () => {
    expect(ids({ a: blankAlt(50), b: blankAlt(50) })).toEqual([])
    expect(ids({ a: blankAlt(0), b: blankAlt(50) })).toEqual([])
  })
})
