import type { AltField, Preferences } from '@/types'

export type Topic = 'discount' | 'transport' | 'extras' | 'payment'

const TOPICS: Topic[] = ['discount', 'transport', 'extras', 'payment']

export const LEARNING_GOAL = 'Aprender a comparar precios'

// Claves: textos de DIFFICULTIES en onboarding/constants.ts.
const DIFFICULTY_TOPICS: Record<string, Topic[]> = {
  'Comparar precios entre tiendas': ['transport'],
  'Saber si un descuento realmente conviene': ['discount'],
  'Calcular transporte y gastos extra': ['transport', 'extras'],
  'Entender los beneficios de pago': ['payment'],
}

// Claves: textos de GOALS en onboarding/constants.ts.
const GOAL_TOPICS: Record<string, Topic[]> = {
  'Gastar menos en mis compras': ['extras'],
  'Aprovechar mejor los descuentos': ['discount'],
  [LEARNING_GOAL]: TOPICS,
}

export const TOPIC_FIELDS: Record<Topic, AltField[]> = {
  discount: ['discount'],
  transport: ['transport'],
  extras: ['extras'],
  payment: ['benefit', 'cashback'],
}

/** Cada dificultad suma 2 y el objetivo 1. */
export function topicWeights({ goal, difficulties }: Preferences): Partial<Record<Topic, number>> {
  const weights: Partial<Record<Topic, number>> = {}
  const add = (topics: Topic[] = [], points: number) => {
    for (const topic of topics) weights[topic] = (weights[topic] ?? 0) + points
  }
  for (const difficulty of difficulties) add(DIFFICULTY_TOPICS[difficulty], 2)
  add(GOAL_TOPICS[goal], 1)
  return weights
}

/** Temas con peso para el usuario, del más al menos importante. */
export function rankTopics(preferences: Preferences): Topic[] {
  const weights = topicWeights(preferences)
  return TOPICS.filter((topic) => weights[topic]).sort(
    (x, y) => (weights[y] ?? 0) - (weights[x] ?? 0),
  )
}

export const TOPIC_PROMISES: Record<Topic, string> = {
  discount: 'Te avisaremos si el mayor descuento no es la compra más barata.',
  transport: 'Revisaremos si el transporte se come lo que ahorras.',
  extras: 'Sumaremos comisiones, envío y otros gastos al costo real.',
  payment: 'Separaremos el cashback de lo que pagas hoy.',
}

export function difficultyFor(topic: Topic, difficulties: string[]) {
  return difficulties.find((d) => DIFFICULTY_TOPICS[d]?.includes(topic))
}

export function highlightedFields(difficulties: string[]): AltField[] {
  const topics = difficulties.flatMap((d) => DIFFICULTY_TOPICS[d] ?? [])
  return [...new Set(topics.flatMap((topic) => TOPIC_FIELDS[topic]))]
}
