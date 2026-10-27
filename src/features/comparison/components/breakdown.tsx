import { cn } from '@/lib/cn'
import { money } from '@/lib/format'
import type { Alt, AltField } from '@/types'

function Row({
  label,
  value,
  highlighted,
}: {
  label: string
  value: string
  highlighted?: boolean
}) {
  return (
    <div
      className={cn(
        'flex justify-between',
        highlighted && '-mx-2 rounded-lg bg-accent/10 px-2 py-1 font-semibold text-ink',
      )}
    >
      <dt>{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  )
}

type BreakdownProps = {
  title: string
  alt: Alt
  cost: number
  /** Oculta descuentos y gastos en cero (útil en ejemplos cortos). */
  hideZero?: boolean
  /** Filas a resaltar (lo que más le cuesta al usuario). */
  highlight?: AltField[]
}

/** Desglose de cómo se llegó al costo de una alternativa. */
export function Breakdown({ title, alt, cost, hideZero, highlight = [] }: BreakdownProps) {
  const show = (value: number) => !hideZero || value > 0
  const hl = (field: AltField) => highlight.includes(field)
  return (
    <div className="border-b border-line py-5">
      <div className="flex justify-between">
        <strong>{title}</strong>
        <span className="font-bold text-forest">{money(cost)}</span>
      </div>
      <dl className="mt-4 grid gap-[9px] text-[13px] text-muted">
        <Row label="Precio original" value={money(alt.price)} />
        {show(alt.discount) && (
          <Row
            label="Descuento inmediato"
            value={`− ${money(alt.discount)}`}
            highlighted={hl('discount')}
          />
        )}
        {show(alt.benefit) && (
          <Row
            label="Beneficio de pago"
            value={`− ${money(alt.benefit)}`}
            highlighted={hl('benefit')}
          />
        )}
        {show(alt.transport) && (
          <Row
            label="Transporte"
            value={`+ ${money(alt.transport)}`}
            highlighted={hl('transport')}
          />
        )}
        {show(alt.extras) && (
          <Row label="Otros gastos" value={`+ ${money(alt.extras)}`} highlighted={hl('extras')} />
        )}
        {alt.cashback > 0 && (
          <div
            className={cn(
              'flex justify-between border-t border-dashed border-line pt-[9px] text-accent',
              hl('cashback') && '-mx-2 rounded-b-lg bg-accent/10 px-2 pb-1 font-semibold',
            )}
          >
            <dt>Cashback posterior</dt>
            <dd className="text-ink">{money(alt.cashback)} aparte</dd>
          </div>
        )}
      </dl>
    </div>
  )
}
