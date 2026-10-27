import { Eyebrow } from '@/components/ui/eyebrow'
import { Breakdown } from '@/features/comparison/components/breakdown'
import { CostBlock } from '@/features/comparison/components/cost-block'
import { compareAlternatives } from '@/features/comparison/lib/calculate-cost'
import { cn } from '@/lib/cn'
import { money } from '@/lib/format'
import { ALT_KEYS } from '@/schemas/comparison.schema'
import { lessonToComparison, type Lesson } from '../lessons'

/** Ejemplo resuelto de una lección: las dos opciones, su desglose y la conclusión. */
export function LessonExample({ lesson, className }: { lesson: Lesson; className?: string }) {
  const { product, context, options, conclusion } = lesson.example
  const outcome = compareAlternatives(lessonToComparison(lesson))
  if (!outcome) return null
  const costs = { a: outcome.aCost, b: outcome.bCost }

  return (
    <section className={cn('mt-9', className)}>
      <Eyebrow>Ejemplo en soles</Eyebrow>
      <h2 className="mt-2 text-[22px] font-bold tracking-[-.03em]">{product}</h2>
      <p className="mt-2 text-sm leading-normal text-muted">{context}</p>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {ALT_KEYS.map((key) => (
          <CostBlock
            key={key}
            label={options[key].label}
            note={options[key].tag}
            cost={costs[key]}
            winner={outcome.winner === key}
          />
        ))}
      </div>

      <div className="mt-2">
        {ALT_KEYS.map((key) => (
          <Breakdown
            key={key}
            title={options[key].label}
            alt={options[key].alt}
            cost={costs[key]}
            hideZero
          />
        ))}
      </div>

      <p className="mt-5 rounded-card border border-accent/40 bg-accent/10 p-4 text-sm leading-normal">
        {conclusion.replace('{diff}', money(outcome.difference))}
      </p>
    </section>
  )
}
