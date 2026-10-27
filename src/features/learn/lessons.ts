import { blankAlt } from '@/features/comparison/lib/factories'
import { topicWeights, type Topic } from '@/features/personalization/topics'
import type { Alt, AltKey, Comparison, Preferences } from '@/types'

export type LessonOption = {
  /** Nombre corto de la opción, p. ej. "Tienda A". */
  label: string
  /** Lo que hace atractiva a la opción a primera vista. */
  tag: string
  alt: Alt
}

export type Lesson = {
  slug: string
  number: string
  minutes: number
  topic: Topic
  /** Texto de la tarjeta (inicio, resultado, índice). */
  card: { title: string; summary: string }
  /** Título de la lección; `em` va en cursiva serif. */
  title: { before: string; em: string; after?: string }
  /** Lo que la mayoría cree. */
  myth: string
  /** Lo que realmente pasa. */
  reality: string
  example: {
    product: string
    context: string
    options: Record<AltKey, LessonOption>
    /** Debe coincidir con el cálculo real; lo verifica lessons.test.ts. */
    winner: AltKey
    /** `{diff}` se reemplaza por la diferencia calculada en soles. */
    conclusion: string
  }
  takeaway: string
  /** Cómo aplicar la idea dentro de AhorraBien. */
  steps: string[]
}

export const LESSONS: Lesson[] = [
  {
    slug: 'descuento-o-precio-final',
    number: '01',
    topic: 'discount',
    minutes: 1,
    card: {
      title: '¿El mayor descuento es la mejor compra?',
      summary: 'Un 20 % de descuento puede salir más caro que no tener descuento.',
    },
    title: { before: '¿Un descuento del ', em: '20 %', after: ' siempre es mejor?' },
    myth: 'La tienda con el porcentaje de descuento más alto es la más barata.',
    reality:
      'El porcentaje se calcula sobre el precio de esa tienda. Si su precio de partida es más alto o el envío es caro, terminas pagando más.',
    example: {
      product: 'Casaca de invierno',
      context: 'Quieres comprar una casaca y dos tiendas en línea la venden:',
      options: {
        a: {
          label: 'Tienda A',
          tag: '20 % de descuento',
          alt: { ...blankAlt(120), discount: 24, transport: 15 },
        },
        b: { label: 'Tienda B', tag: 'Sin descuento, envío gratis', alt: blankAlt(105) },
      },
      winner: 'b',
      conclusion: 'La Tienda B te ahorra {diff}, aunque no tenga ningún descuento.',
    },
    takeaway: 'Compara cuánto sale de tu bolsillo al final, no el porcentaje del cartel.',
    steps: [
      'Ingresa el precio original de cada tienda.',
      'En “Descuento inmediato” escribe el monto en soles: el 20 % de S/ 120 son S/ 24.',
      'Suma el envío en “Transporte” y deja que AhorraBien calcule el total.',
    ],
  },
  {
    slug: 'transporte-tambien-cuesta',
    number: '02',
    topic: 'transport',
    minutes: 1,
    card: {
      title: 'El transporte también es parte del precio',
      summary: 'Ir lejos por una oferta puede costarte más de lo que ahorras.',
    },
    title: { before: 'Ir lejos por una oferta, ', em: '¿vale la pena?' },
    myth: 'Si en otro lugar está más barato, conviene ir hasta allá.',
    reality:
      'Los pasajes o el taxi de ida y vuelta se suman al precio. Una diferencia pequeña en la etiqueta desaparece rápido.',
    example: {
      product: 'Licuadora',
      context:
        'Necesitas una licuadora. Comparas la tienda de tu barrio con un centro comercial lejano:',
      options: {
        a: { label: 'Tienda del barrio', tag: 'Vas caminando', alt: blankAlt(89) },
        b: {
          label: 'Centro comercial',
          tag: 'S/ 7 más barata',
          alt: { ...blankAlt(82), transport: 16 },
        },
      },
      winner: 'a',
      conclusion:
        'Comprar cerca te ahorra {diff}, aunque la etiqueta del centro comercial sea S/ 7 más baja.',
    },
    takeaway: 'Antes de moverte por una oferta, suma lo que te cuesta ir y volver.',
    steps: [
      'Calcula el transporte de ida y vuelta: pasajes, taxi o gasolina.',
      'Ingrésalo en “Transporte” dentro de los detalles de cada alternativa.',
      'Si en el mismo viaje compras varias cosas, reparte ese costo entre ellas.',
    ],
  },
  {
    slug: 'cashback-llega-despues',
    number: '03',
    topic: 'payment',
    minutes: 1,
    card: {
      title: 'El cashback no es un descuento',
      summary: 'Llega después y con condiciones: no lo restes del precio de hoy.',
    },
    title: { before: 'El cashback ', em: 'llega después' },
    myth: 'Un cashback de S/ 20 es lo mismo que pagar S/ 20 menos.',
    reality:
      'Hoy pagas el precio completo. El cashback suele llegar semanas después como saldo o puntos, y puede vencer o pedir un monto mínimo para usarlo.',
    example: {
      product: 'Zapatillas',
      context:
        'Unas zapatillas se venden en dos tiendas. Una ofrece 10 % de cashback si pagas con su billetera digital:',
      options: {
        a: { label: 'Tienda A', tag: '10 % de cashback', alt: { ...blankAlt(200), cashback: 20 } },
        b: { label: 'Tienda B', tag: 'Sin cashback', alt: blankAlt(190) },
      },
      winner: 'b',
      conclusion:
        'Con la Tienda B pagas {diff} menos hoy. El cashback de A solo compensa si estás seguro de usarlo antes de que venza.',
    },
    takeaway: 'Trata el cashback como un premio extra, no como parte del precio.',
    steps: [
      'Registra el cashback en “Cashback posterior (referencial)”.',
      'AhorraBien lo muestra aparte en el desglose, sin restarlo del costo.',
      'Revisa sus condiciones: vencimiento, monto mínimo y dónde se puede usar.',
    ],
  },
  {
    slug: 'gastos-pequenos-suman',
    number: '04',
    topic: 'extras',
    minutes: 1,
    card: {
      title: 'Los gastos pequeños suman',
      summary: 'Comisiones, envío y empaque pueden cambiar cuál opción gana.',
    },
    title: { before: 'Los gastos ', em: 'pequeños', after: ' también cuentan' },
    myth: 'Si el precio en internet es menor, comprar en línea siempre conviene.',
    reality:
      'La tarifa de servicio, el envío o el empaque aparecen recién al pagar y pueden superar la diferencia de precio.',
    example: {
      product: 'Juego de mesa',
      context: 'Quieres un juego de mesa. Lo ves en una app de delivery y en una tienda física:',
      options: {
        a: {
          label: 'App de delivery',
          tag: 'S/ 8 más barato',
          alt: { ...blankAlt(60), transport: 9, extras: 4 },
        },
        b: { label: 'Tienda física', tag: 'Queda en tu camino', alt: blankAlt(68) },
      },
      winner: 'b',
      conclusion:
        'En la tienda física pagas {diff} menos, aunque en la app el precio se veía S/ 8 más bajo.',
    },
    takeaway: 'Mira el total del carrito antes de pagar, no solo el precio del producto.',
    steps: [
      'Avanza hasta la pantalla de pago para ver todos los cargos.',
      'Pon el envío en “Transporte” y las tarifas o comisiones en “Otros gastos”.',
      'Compara ese total con la otra opción.',
    ],
  },
]

export const getLesson = (slug: string) => LESSONS.find((lesson) => lesson.slug === slug)

export const getNextLesson = (slug: string) => {
  const index = LESSONS.findIndex((lesson) => lesson.slug === slug)
  return index === -1 ? undefined : LESSONS[index + 1]
}

/** Lección más útil según los datos de una comparación. */
export function suggestLesson({ a, b }: Pick<Comparison, 'a' | 'b'>): Lesson {
  const pick = (slug: string) => getLesson(slug) ?? LESSONS[0]
  if (a.cashback > 0 || b.cashback > 0) return pick('cashback-llega-despues')
  if (a.extras > 0 || b.extras > 0) return pick('gastos-pequenos-suman')
  if (a.transport !== b.transport) return pick('transporte-tambien-cuesta')
  return pick('descuento-o-precio-final')
}

export const lessonForTopic = (topic: Topic) => LESSONS.find((lesson) => lesson.topic === topic)

/** Sin preferencias se mantiene el orden original. */
export function rankLessons(preferences: Preferences) {
  const weights = topicWeights(preferences)
  return LESSONS.map((lesson) => ({ lesson, score: weights[lesson.topic] ?? 0 })).sort(
    (x, y) => y.score - x.score,
  )
}

/** Convierte el ejemplo de una lección en un borrador para el comparador. */
export function lessonToComparison(lesson: Lesson): Comparison {
  const { product, options } = lesson.example
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    product,
    a: options.a.alt,
    b: options.b.alt,
  }
}
