import { describe, expect, it } from 'vitest'
import { DIFFICULTIES, GOALS } from '@/features/onboarding/constants'
import { LEARNING_GOAL, difficultyFor, highlightedFields, rankTopics, topicWeights } from './topics'

describe('topics', () => {
  it('cada dificultad suma 2 y el objetivo suma 1', () => {
    expect(
      topicWeights({
        goal: 'Aprovechar mejor los descuentos',
        difficulties: [
          'Saber si un descuento realmente conviene',
          'Calcular transporte y gastos extra',
        ],
      }),
    ).toEqual({ discount: 3, transport: 2, extras: 2 })
    expect(topicWeights({ goal: '', difficulties: [] })).toEqual({})
  })

  it('cubre todas las opciones del onboarding', () => {
    for (const difficulty of DIFFICULTIES) {
      expect(
        Object.keys(topicWeights({ goal: '', difficulties: [difficulty] })).length,
      ).toBeGreaterThan(0)
    }
    for (const goal of GOALS) {
      expect(() => topicWeights({ goal, difficulties: [] })).not.toThrow()
    }
  })

  it('el objetivo de aprender da peso a todos los temas', () => {
    expect(rankTopics({ goal: LEARNING_GOAL, difficulties: [] })).toEqual([
      'discount',
      'transport',
      'extras',
      'payment',
    ])
  })

  it('ordena los temas por peso y omite los que no importan', () => {
    expect(
      rankTopics({
        goal: 'Gastar menos en mis compras',
        difficulties: ['Entender los beneficios de pago'],
      }),
    ).toEqual(['payment', 'extras'])
    expect(rankTopics({ goal: '', difficulties: [] })).toEqual([])
  })

  it('resalta los campos del desglose según las dificultades', () => {
    expect(highlightedFields(['Calcular transporte y gastos extra'])).toEqual([
      'transport',
      'extras',
    ])
    expect(highlightedFields(['Entender los beneficios de pago'])).toEqual(['benefit', 'cashback'])
    expect(highlightedFields([])).toEqual([])
  })

  it('encuentra la dificultad que explica un tema', () => {
    const marked = ['Entender los beneficios de pago', 'Calcular transporte y gastos extra']
    expect(difficultyFor('extras', marked)).toBe('Calcular transporte y gastos extra')
    expect(difficultyFor('discount', marked)).toBeUndefined()
  })
})
