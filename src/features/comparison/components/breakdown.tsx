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

type BreakdownProps = { side: string; alt: Alt; cost: number }

/** Desglose de cómo se llegó al costo de una alternativa. */
export function Breakdown({ side, alt, cost }: BreakdownProps) {
  return (
    <div className="border-b border-line py-5">
      <div className="flex justify-between">
        <strong>Alternativa {side}</strong>
        <span className="font-bold text-forest">{money(cost)}</span>
      </div>
      <dl className="mt-4 grid gap-[9px] text-[13px] text-muted">
        <Row label="Precio original" value={money(alt.price)} />
        <Row label="Descuento inmediato" value={`− ${money(alt.discount)}`} />
        <Row label="Beneficio de pago" value={`− ${money(alt.benefit)}`} />
        <Row label="Transporte" value={`+ ${money(alt.transport)}`} />
        <Row label="Otros gastos" value={`+ ${money(alt.extras)}`} />
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
