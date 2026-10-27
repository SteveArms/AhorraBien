import { Icon } from '@/components/ui/icon'
import { compareAlternatives } from '@/features/comparison/lib/calculate-cost'
import { exampleComparison } from '@/features/comparison/lib/factories'
import { cn } from '@/lib/cn'
import { money } from '@/lib/format'
import { ALT_KEYS } from '@/schemas/comparison.schema'

// El mismo ejemplo de la demo: los montos salen de la fórmula real, no se escriben a mano.
const SAMPLE = exampleComparison()
const OUTCOME = compareAlternatives(SAMPLE)

/** Resultado de muestra de la bienvenida: lo que la persona obtendrá, marcado como ejemplo. */
export function SampleResult({ className }: { className?: string }) {
  if (!OUTCOME) return null
  const { winner, difference } = OUTCOME
  const costs = { a: OUTCOME.aCost, b: OUTCOME.bCost }

  return (
    <figure
      className={cn(
        'rounded-card border border-line bg-paper p-4 shadow-[0_8px_22px_#244d3b1d]',
        className,
      )}
    >
      <figcaption className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-bold tracking-[.1em] text-accent-strong uppercase">Ejemplo</span>
        <span className="truncate text-muted">{SAMPLE.product}</span>
      </figcaption>
      <table className="mt-2.5 w-full text-sm tabular-nums">
        <thead>
          <tr className="text-xs text-muted">
            <th scope="col" className="pb-1 text-left font-normal">
              Alternativa
            </th>
            <th scope="col" className="pb-1 text-right font-normal">
              Precio
            </th>
            <th scope="col" className="pb-1 text-right font-normal">
              Costo real
            </th>
          </tr>
        </thead>
        <tbody>
          {ALT_KEYS.map((key) => (
            <tr key={key} className={cn(winner === key && 'font-bold text-forest')}>
              <th scope="row" className="py-0.5 text-left font-[inherit]">
                {key.toUpperCase()}
              </th>
              <td className="py-0.5 text-right">{money(SAMPLE[key].price)}</td>
              <td className="py-0.5 text-right">
                <span className="inline-flex items-center gap-1">
                  {winner === key && <Icon name="check" size={14} />}
                  {money(costs[key])}
                  {winner === key && <span className="sr-only">(mejor costo)</span>}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2.5 border-t border-line pt-2.5 text-[13px] leading-snug text-pretty">
        {winner === 'tie' ? (
          'Con descuentos, beneficios y transporte, ambas cuestan lo mismo.'
        ) : (
          <>
            Con descuentos, beneficios y transporte, {winner.toUpperCase()} cuesta{' '}
            <strong className="text-forest">{money(difference)} menos</strong>.
          </>
        )}
      </p>
    </figure>
  )
}
