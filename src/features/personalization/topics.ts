import type { AltField, Preferences } from '@/types'

/** Temas de compra que conectan el onboarding con lecciones, alertas y el desglose. */
export type Topic = 'discount' | 'transport' | 'extras' | 'payment'

/** Claves = textos de DIFFICULTIES (features/onboarding/constants.ts). */
const DIFFICULTY_TOPICS: Record<string, Topic[]> = {
  'Comparar precios entre tiendas': ['transport'],
  'Saber si un descuento realmente conviene': ['discount'],
  'Calcular transporte y gastos extra': ['transport', 'extras'],
  'Entender los beneficios de pago': ['payment'],
}

/** Claves = textos de GOALS (features/onboarding/constants.ts). */
const GOAL_TOPICS: Record<string, Topic[]> = {
  'Gastar menos en mis compras': ['extras'],
  'Aprovechar mejor los descuentos': ['discount'],
  'Aprender a comparar precios': [],
}

/** Filas del desglose que corresponden a cada tema. */
export const TOPIC_FIELDS: Record<Topic, AltField[]> = {
  discount: ['discount'],
  transport: ['transport'],
  extras: ['extras'],
  payment: ['benefit', 'cashback'],
}

/** Peso de cada tema para el usuario: cada dificultad suma 2 y el objetivo suma 1. */
export function topicWeights({ goal, difficulties }: Preferences): Partial<Record<Topic, number>> {
  const weights: Partial<Record<Topic, number>> = {}
  const add = (topics: Topic[] = [], points: number) => {
    for (const topic of topics) weights[topic] = (weights[topic] ?? 0) + points
  }
  for (const difficulty of difficulties) add(DIFFICULTY_TOPICS[difficulty], 2)
  add(GOAL_TOPICS[goal], 1)
  return weights
}

/** Dificultad marcada que explica un tema (para decirle al usuario por qué lo resaltamos). */
export function difficultyFor(topic: Topic, difficulties: string[]) {
  return difficulties.find((d) => DIFFICULTY_TOPICS[d]?.includes(topic))
}

/** Campos del desglose que conviene resaltar según las dificultades marcadas. */
export function highlightedFields(difficulties: string[]): AltField[] {
  const topics = difficulties.flatMap((d) => DIFFICULTY_TOPICS[d] ?? [])
  return [...new Set(topics.flatMap((topic) => TOPIC_FIELDS[topic]))]
}
