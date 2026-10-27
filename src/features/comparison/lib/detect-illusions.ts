import type { Topic } from '@/features/personalization/topics'
import { money } from '@/lib/format'
import { ALT_KEYS } from '@/schemas/comparison.schema'
import type { Alt, AltKey, Comparison } from '@/types'
import { calculateCost, compareAlternatives } from './calculate-cost'

export type Illusion = {
  id: 'discount-trap' | 'costs-eat-discount' | 'sticker-price' | 'cashback-later'
  topic: Topic
  title: string
  description: string
}

const label = (key: AltKey) => key.toUpperCase()
const reductions = (alt: Alt) => alt.discount + alt.benefit
const addedCosts = (alt: Alt) => alt.transport + alt.extras

/** Las alertas de los temas con más peso para el usuario van primero. */
export function detectIllusions(
  comparison: Pick<Comparison, 'a' | 'b'>,
  weights: Partial<Record<Topic, number>> = {},
): Illusion[] {
  const outcome = compareAlternatives(comparison)
  if (!outcome) return []
  const { winner } = outcome
  const loser: AltKey | null = winner === 'tie' ? null : winner === 'a' ? 'b' : 'a'
  const found: Illusion[] = []

  if (loser && reductions(comparison[loser]) > reductions(comparison[winner as AltKey])) {
    found.push({
      id: 'discount-trap',
      topic: 'discount',
      title: 'El mayor descuento no ganó',
      description: `La alternativa ${label(loser)} descuenta ${money(reductions(comparison[loser]))}, pero al final cuesta ${money(outcome.difference)} más.`,
    })
  }

  for (const key of ALT_KEYS) {
    const alt = comparison[key]
    if (reductions(alt) > 0 && addedCosts(alt) >= reductions(alt)) {
      found.push({
        id: 'costs-eat-discount',
        topic: alt.transport >= alt.extras ? 'transport' : 'extras',
        title: 'Los gastos se comen el descuento',
        description: `En la alternativa ${label(key)}, transporte y otros gastos (${money(addedCosts(alt))}) igualan o superan lo que ahorras (${money(reductions(alt))}).`,
      })
      break
    }
  }

  if (loser && comparison[loser].price < comparison[winner as AltKey].price) {
    found.push({
      id: 'sticker-price',
      topic: comparison[loser].transport >= comparison[loser].extras ? 'transport' : 'extras',
      title: 'La etiqueta más baja no es la más barata',
      description: `La alternativa ${label(loser)} tiene el precio de etiqueta más bajo, pero los gastos adicionales la vuelven más cara.`,
    })
  }

  const withCashback = ALT_KEYS.find((key) => comparison[key].cashback > 0)
  if (withCashback) {
    const alt = comparison[withCashback]
    const other = comparison[withCashback === 'a' ? 'b' : 'a']
    const flips =
      withCashback === loser &&
      (calculateCost(alt) ?? 0) - alt.cashback < (calculateCost(other) ?? 0)
    found.push({
      id: 'cashback-later',
      topic: 'payment',
      title: flips
        ? 'El cashback cambiaría el ganador, pero llega después'
        : 'El cashback no se resta',
      description: `La alternativa ${label(withCashback)} devuelve ${money(alt.cashback)} más adelante. No lo restamos porque no es dinero que ahorras al pagar.`,
    })
  }

  // Orden estable: a igual peso se respeta el orden de detección.
  return found.sort((x, y) => (weights[y.topic] ?? 0) - (weights[x.topic] ?? 0))
}
