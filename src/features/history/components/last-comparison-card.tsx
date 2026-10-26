import { Icon } from '@/components/ui/icon'
import { compareAlternatives } from '@/features/comparison/lib/calculate-cost'
import { money } from '@/lib/format'
import type { Comparison } from '@/types'

type LastComparisonCardProps = { comparison: Comparison; onOpen: () => void }

/** Tarjeta destacada con la comparación más reciente (pantalla de inicio). */
export function LastComparisonCard({ comparison, onOpen }: LastComparisonCardProps) {
  const outcome = compareAlternatives(comparison)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mt-3.5 flex w-full items-center justify-between rounded-card border-0 bg-forest p-5 text-left text-paper"
    >
      <div className="grid gap-[7px]">
        <small className="text-[9px] tracking-[.12em] opacity-65">ÚLTIMA COMPARACIÓN</small>
        <strong>{comparison.product}</strong>
      </div>
      <span className="flex items-center gap-1 font-bold">
        {outcome && money(Math.min(outcome.aCost, outcome.bCost))}
        <Icon name="arrow" />
      </span>
    </button>
  )
}
