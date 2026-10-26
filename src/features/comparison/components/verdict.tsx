import { money } from '@/lib/format'
import type { ComparisonOutcome } from '@/types'

/** Recomendación en texto según quién gana. */
export function Verdict({ outcome }: { outcome: ComparisonOutcome }) {
  const { winner, difference } = outcome
  const tie = winner === 'tie'
  return (
    <div className="mt-[18px] mb-8 grid grid-cols-[40px_1fr] items-start gap-[13px]">
      <span className="grid size-10 place-items-center rounded-full bg-accent font-bold text-paper">
        {tie ? '=' : winner.toUpperCase()}
      </span>
      <p className="text-sm leading-normal">
        {tie
          ? 'Hay un empate. Compara garantía, calidad o facilidad de devolución.'
          : `Te conviene la alternativa ${winner.toUpperCase()}. Su costo final es ${money(difference)} más bajo según los datos ingresados.`}
      </p>
    </div>
  )
}
