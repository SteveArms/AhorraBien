import { money } from '@/lib/format'
import type { AltKey, Comparison } from '@/types'
import { compareAlternatives } from './calculate-cost'

export type NextStep = {
  id: 'payment-dependent' | 'add-transport' | 'tie' | 'small-difference'
  text: string
  action?: { label: string; href: string }
}

const SMALL_DIFFERENCE = 2

/** Qué hacer después del resultado, calculado con los datos de la comparación (máximo dos). */
export function nextSteps(comparison: Pick<Comparison, 'a' | 'b'>): NextStep[] {
  const outcome = compareAlternatives(comparison)
  if (!outcome) return []
  const { winner, difference } = outcome
  const steps: NextStep[] = []

  if (winner !== 'tie') {
    const { benefit } = comparison[winner as AltKey]
    if (benefit > 0 && benefit >= difference) {
      steps.push({
        id: 'payment-dependent',
        text: `El ahorro de la alternativa ${winner.toUpperCase()} depende de su beneficio de pago (${money(benefit)}). Confirma que puedes usarlo: sin él, la otra cuesta lo mismo o menos.`,
      })
    }
  }

  if (comparison.a.transport === 0 && comparison.b.transport === 0) {
    steps.push({
      id: 'add-transport',
      text: '¿Vas a ir a la tienda o pedir envío? Agrega el transporte: puede cambiar el ganador.',
      action: { label: 'Agregar transporte', href: '/comparar/a' },
    })
  }

  if (winner === 'tie') {
    steps.push({ id: 'tie', text: 'Pagan lo mismo: decide por garantía, devolución o cercanía.' })
  } else if (difference < SMALL_DIFFERENCE) {
    steps.push({
      id: 'small-difference',
      text: `La diferencia es de solo ${money(difference)}: compara también garantía, devolución y cercanía.`,
    })
  }

  return steps.slice(0, 2)
}
