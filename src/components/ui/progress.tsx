const TOTAL_STEPS = 3

/** Barra de progreso del onboarding (pasos 1 a 3). */
export function Progress({ step }: { step: number }) {
  return (
    <div
      role="progressbar"
      aria-label={`Paso ${step} de ${TOTAL_STEPS}`}
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
      aria-valuenow={step}
      className="mt-[15px] mb-11 h-[3px] overflow-hidden rounded-[3px] bg-line short:mb-[25px]"
    >
      <span
        className="block h-full bg-accent transition-[width] duration-300"
        style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
      />
    </div>
  )
}
