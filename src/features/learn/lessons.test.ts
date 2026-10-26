import { describe, expect, it } from 'vitest'
import { compareAlternatives } from '@/features/comparison/lib/calculate-cost'
import { blankAlt } from '@/features/comparison/lib/factories'
import { comparisonSchema } from '@/schemas/comparison.schema'
import { LESSONS, getNextLesson, lessonToComparison, suggestLesson } from './lessons'

describe('LESSONS', () => {
  it('tienen slugs y números únicos', () => {
    expect(new Set(LESSONS.map((l) => l.slug)).size).toBe(LESSONS.length)
    expect(new Set(LESSONS.map((l) => l.number)).size).toBe(LESSONS.length)
  })

  it.each(LESSONS.map((l) => [l.slug, l] as const))(
    '%s: el ganador declarado coincide con el cálculo',
    (_, lesson) => {
      const outcome = compareAlternatives(lessonToComparison(lesson))
      expect(outcome).not.toBeNull()
      expect(outcome!.winner).toBe(lesson.example.winner)
      expect(outcome!.difference).toBeGreaterThan(0)
      expect(lesson.example.conclusion).toContain('{diff}')
    },
  )

  it('convierte cada ejemplo en una comparación válida', () => {
    for (const lesson of LESSONS) {
      expect(comparisonSchema.safeParse(lessonToComparison(lesson)).success).toBe(true)
    }
  })

  it('getNextLesson devuelve la siguiente o undefined al final', () => {
    expect(getNextLesson(LESSONS[0].slug)).toBe(LESSONS[1])
    expect(getNextLesson(LESSONS.at(-1)!.slug)).toBeUndefined()
  })
})

describe('suggestLesson', () => {
  it('prioriza cashback, luego gastos extra, luego transporte', () => {
    const base = { a: blankAlt(10), b: blankAlt(10) }
    expect(suggestLesson({ ...base, a: { ...blankAlt(10), cashback: 1 } }).slug).toBe(
      'cashback-llega-despues',
    )
    expect(suggestLesson({ ...base, b: { ...blankAlt(10), extras: 1 } }).slug).toBe(
      'gastos-pequenos-suman',
    )
    expect(suggestLesson({ ...base, b: { ...blankAlt(10), transport: 3 } }).slug).toBe(
      'transporte-tambien-cuesta',
    )
    expect(suggestLesson(base).slug).toBe('descuento-o-precio-final')
  })
})
