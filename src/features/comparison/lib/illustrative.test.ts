import { describe, expect, it } from 'vitest'
import { LESSONS, lessonToComparison } from '@/features/learn/lessons'
import { exampleComparison } from './factories'
import { isIllustrative } from './illustrative'

describe('isIllustrative', () => {
  it('reconoce el ejemplo de la demo y los de las lecciones sin modificar', () => {
    expect(isIllustrative(exampleComparison())).toBe(true)
    for (const lesson of LESSONS) expect(isIllustrative(lessonToComparison(lesson))).toBe(true)
  })

  it('no marca como ejemplo un producto propio con el mismo nombre', () => {
    const own = { ...exampleComparison(), a: { ...exampleComparison().a, price: 80 } }
    expect(isIllustrative(own)).toBe(false)
    const lesson = lessonToComparison(LESSONS[1])
    expect(isIllustrative({ ...lesson, b: { ...lesson.b, transport: 9 } })).toBe(false)
  })

  it('deja de ser ejemplo si se renombra', () => {
    expect(isIllustrative({ ...exampleComparison(), product: 'Zapatillas deportivas' })).toBe(false)
  })
})
