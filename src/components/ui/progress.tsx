import { cn } from '@/lib/cn'
import { Eyebrow } from './eyebrow'

type ProgressProps = {
  step: number
  total?: number
  /** Nombre del paso, p. ej. "Tu plan": se muestra como "Paso 3 de 4 · Tu plan". */
  label?: string
  className?: string
}

/**
 * "Paso N de M" con su barra. Por defecto, los 4 del recorrido inicial:
 * objetivo, dificultades, plan y comparar (el último lo muestra el comparador).
 */
export function Progress({ step, total = 4, label, className }: ProgressProps) {
  return (
    <div className={cn('mt-[15px] mb-11 flex items-center gap-3 short:mb-[25px]', className)}>
      <Eyebrow className="shrink-0">
        Paso {step} de {total}
        {label && ` · ${label}`}
      </Eyebrow>
      {/* El texto ya lo dice; la barra solo lo refuerza a la vista. */}
      <div aria-hidden="true" className="h-[3px] flex-1 overflow-hidden rounded-[3px] bg-line">
        <span
          className="block h-full bg-accent transition-[width] duration-300"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
