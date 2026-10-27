import { Icon } from '@/components/ui/icon'
import { compareAlternatives } from '@/features/comparison/lib/calculate-cost'
import { formatShortDate, money } from '@/lib/format'
import type { Comparison } from '@/types'

type HistoryItemProps = { comparison: Comparison; index: number; onOpen: () => void }

export function HistoryItem({ comparison, index, onOpen }: HistoryItemProps) {
  const outcome = compareAlternatives(comparison)
  if (!outcome) return null
  const { aCost, bCost, winner, difference } = outcome
  const tie = winner === 'tie'

  return (
    <button
      type="button"
      onClick={onOpen}
      className="grid w-full grid-cols-[28px_1fr_auto] items-start gap-2.5 border-0 border-b border-line bg-transparent py-5 text-left transition-colors duration-150 lg:rounded-card lg:border lg:bg-paper lg:p-5 lg:hover:border-forest"
    >
      <span className="font-serif text-accent-strong italic">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="grid min-w-0 gap-[5px]">
        <strong className="truncate">{comparison.product}</strong>
        <small className="text-[10px] text-muted">
          {formatShortDate(comparison.date)} · Resultado: {tie ? 'Empate' : winner.toUpperCase()}
        </small>
        <p className="flex items-center gap-[7px] text-xs">
          A {money(aCost)} <i className="size-1 rounded-full bg-accent" /> B {money(bCost)}
        </p>
      </div>
      <span className="flex items-center text-[10px] font-bold text-forest">
        {tie ? 'Empate' : `${money(difference)} menos`}
        <Icon name="arrow" size={16} />
      </span>
    </button>
  )
}
