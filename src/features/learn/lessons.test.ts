import { describe, expect, it } from 'vitest'
import { compareAlternatives } from '@/features/comparison/lib/calculate-cost'
import { blankAlt } from '@/features/comparison/lib/factories'
import { comparisonSchema } from '@/schemas/comparison.schema'
import {
  LESSONS,
  getNextLesson,
  isLessonExample,
  lessonForTopic,
  lessonToComparison,
  rankLessons,
  suggestLesson,
} from './lessons'

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

  it('sus textos no tienen caracteres de control y no separan el número del %', () => {
    const strings: string[] = []
    JSON.stringify(LESSONS, (_, value) => {
      if (typeof value === 'string') strings.push(value)
      return value
    })
    const text = strings.join('\n')
    expect(text).not.toMatch(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/)
    expect(text).not.toMatch(/\d %/)
  })

  it('getNextLesson devuelve la siguiente o undefined al final', () => {
    expect(getNextLesson(LESSONS[0].slug)).toBe(LESSONS[1])
    expect(getNextLesson(LESSONS.at(-1)!.slug)).toBeUndefined()
  })
})

describe('rankLessons', () => {
  it('sin preferencias mantiene el orden original', () => {
    expect(rankLessons({ goal: '', difficulties: [] }).map((r) => r.lesson)).toEqual(LESSONS)
  })

  it('pone primero las lecciones de lo que más le cuesta al usuario', () => {
    const ranked = rankLessons({
      goal: 'Gastar menos en mis compras',
      difficulties: ['Entender los beneficios de pago'],
    })
    expect(ranked.map((r) => r.lesson.slug).slice(0, 2)).toEqual([
      'cashback-llega-despues',
      'gastos-pequenos-suman',
    ])
    expect(ranked.at(-1)!.score).toBe(0)
  })

  it('cada tema tiene su lección', () => {
    for (const topic of ['discount', 'transport', 'extras', 'payment'] as const) {
      expect(lessonForTopic(topic)?.topic).toBe(topic)
    }
  })
})

describe('isLessonExample', () => {
  it('reconoce el ejemplo intacto, pero no un producto propio con el mismo nombre', () => {
    const example = lessonToComparison(LESSONS[1])
    expect(isLessonExample(example)).toBe(true)
    expect(isLessonExample({ ...example, a: { ...example.a, price: 50 } })).toBe(false)
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
