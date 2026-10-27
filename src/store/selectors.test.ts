import { describe, expect, it } from 'vitest'
import { blankAlt, exampleComparison } from '@/features/comparison/lib/factories'
import type { AppStore } from './app-store'
import { selectTotalSavings } from './selectors'

describe('selectTotalSavings', () => {
  it('suma solo las comparaciones propias, no los ejemplos', () => {
    const own = {
      ...exampleComparison(),
      id: 'propia',
      product: 'Silla',
      a: blankAlt(250),
      b: blankAlt(230),
    }
    const state = { saved: [exampleComparison(), own] } as AppStore
    expect(selectTotalSavings(state)).toBe(20)
  })
})
