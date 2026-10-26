import { ButtonLink } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Screen } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'

/** Micro-lección sobre descuentos (/aprender). Pantalla estática, se puede renderizar en servidor. */
export function LessonScreen() {
  return (
    <Screen className="bg-forest text-paper">
      <ScreenHeader title="Aprendizaje" backHref="/resultado" tone="inverse" />
      <div className="mt-[45px] mb-5 font-serif text-[130px] leading-[.9] text-accent italic opacity-90">
        01
      </div>
      <section>
        <Eyebrow>Un minuto para comprar mejor</Eyebrow>
        <h1 className="mt-2.5 mb-[25px] [&_em]:text-accent">
          ¿Un descuento del <em>20 %</em> siempre es mejor?
        </h1>
        <p className="leading-relaxed text-white/75">
          No necesariamente. Compara el precio final y suma los gastos adicionales. Un descuento
          mayor puede no compensar un precio inicial elevado o un transporte más caro.
        </p>
        <div className="my-[30px] grid grid-cols-[1fr_auto_1fr] items-center border-y border-white/20 py-[18px]">
          <div className="grid gap-[5px]">
            <span className="text-[10px] uppercase opacity-65">Precio</span>
            <strong>S/ 120</strong>
          </div>
          <b>−20 %</b>
          <div className="grid gap-[5px] text-right">
            <span className="text-[10px] uppercase opacity-65">Con envío</span>
            <strong>S/ 106</strong>
          </div>
        </div>
        <ButtonLink href="/resultado" className="w-full bg-paper text-forest">
          Volver a la comparación
        </ButtonLink>
      </section>
    </Screen>
  )
}
