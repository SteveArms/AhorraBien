import { describe, expect, it } from 'vitest'
import { blankAlt, exampleComparison } from './factories'
import { nextSteps } from './next-steps'

const ids = (...args: Parameters<typeof nextSteps>) => nextSteps(...args).map((s) => s.id)

describe('nextSteps', () => {
  it('avisa si el ahorro depende del beneficio de pago (ejemplo de la demo)', () => {
    expect(ids(exampleComparison())).toEqual(['payment-dependent'])
  })

  it('sugiere agregar el transporte si ninguna alternativa lo tiene', () => {
    const [step] = nextSteps({ a: blankAlt(250), b: blankAlt(230) })
    expect(step).toMatchObject({ id: 'add-transport', action: { href: '/comparar/a' } })
  })

  it('en un empate o con una diferencia mínima propone mirar otros factores', () => {
    const conTransporte = (price: number) => ({ ...blankAlt(price), transport: 5 })
    expect(ids({ a: conTransporte(100), b: conTransporte(100) })).toEqual(['tie'])
    expect(ids({ a: conTransporte(100), b: conTransporte(99) })).toEqual(['small-difference'])
  })

  it('no sugiere nada si los datos están completos y la diferencia es clara', () => {
    const a = { ...blankAlt(300), transport: 10 }
    const b = { ...blankAlt(250), transport: 10 }
    expect(nextSteps({ a, b })).toEqual([])
  })

  it('devuelve como máximo dos pasos', () => {
    expect(nextSteps({ a: blankAlt(100), b: blankAlt(100) })).toHaveLength(2)
  })
})
