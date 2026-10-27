import { cn } from '@/lib/cn'

type ProgressProps = { step: number; total?: number; className?: string }

/** Barra de progreso por pasos (por defecto, los 3 del onboarding). */
export function Progress({ step, total = 3, className }: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-label={`Paso ${step} de ${total}`}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      className={cn(
        'mt-[15px] mb-11 h-[3px] overflow-hidden rounded-[3px] bg-line short:mb-[25px]',
        className,
      )}
    >
      <span
        className="block h-full bg-accent transition-[width] duration-300"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  )
}
