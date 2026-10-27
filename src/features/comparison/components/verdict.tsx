import { Icon } from '@/components/ui/icon'
import { money } from '@/lib/format'
import type { ComparisonOutcome } from '@/types'

/** Recomendación en texto según quién gana. */
export function Verdict({
  outcome,
  onExplain,
}: {
  outcome: ComparisonOutcome
  onExplain?: () => void
}) {
  const { winner, difference } = outcome
  const tie = winner === 'tie'
  return (
    <div className="mt-[18px] mb-8 grid grid-cols-[40px_1fr] items-start gap-[13px]">
      <span className="grid size-10 place-items-center rounded-full bg-accent-strong font-bold text-paper">
        {tie ? '=' : winner.toUpperCase()}
      </span>
      <div>
        <p className="text-sm leading-normal">
          {tie
            ? 'Hay un empate. Compara garantía, calidad o facilidad de devolución.'
            : `Te conviene la alternativa ${winner.toUpperCase()}. Su costo final es ${money(difference)} más bajo según los datos ingresados.`}
        </p>
        {!tie && onExplain && (
          <button
            type="button"
            onClick={onExplain}
            className="mt-2 inline-flex min-h-6 items-center gap-1 border-0 bg-transparent p-0 text-xs font-bold text-forest underline-offset-2 hover:underline"
          >
            Ver por qué gana {winner.toUpperCase()}
            <Icon name="arrow" size={14} className="rotate-90" />
          </button>
        )}
      </div>
    </div>
  )
}
