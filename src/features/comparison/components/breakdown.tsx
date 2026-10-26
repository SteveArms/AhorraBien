import { money } from '@/lib/format'
import type { Alt } from '@/types'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
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
}

/** Desglose de cómo se llegó al costo de una alternativa. */
export function Breakdown({ title, alt, cost, hideZero }: BreakdownProps) {
  const show = (value: number) => !hideZero || value > 0
  return (
    <div className="border-b border-line py-5">
      <div className="flex justify-between">
        <strong>{title}</strong>
        <span className="font-bold text-forest">{money(cost)}</span>
      </div>
      <dl className="mt-4 grid gap-[9px] text-[13px] text-muted">
        <Row label="Precio original" value={money(alt.price)} />
        {show(alt.discount) && (
          <Row label="Descuento inmediato" value={`− ${money(alt.discount)}`} />
        )}
        {show(alt.benefit) && <Row label="Beneficio de pago" value={`− ${money(alt.benefit)}`} />}
        {show(alt.transport) && <Row label="Transporte" value={`+ ${money(alt.transport)}`} />}
        {show(alt.extras) && <Row label="Otros gastos" value={`+ ${money(alt.extras)}`} />}
        {alt.cashback > 0 && (
          <div className="flex justify-between border-t border-dashed border-line pt-[9px] text-accent">
            <dt>Cashback posterior</dt>
            <dd className="text-ink">{money(alt.cashback)} aparte</dd>
          </div>
        )}
      </dl>
    </div>
  )
}
