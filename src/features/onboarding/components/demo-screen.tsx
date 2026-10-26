'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Screen, StickyActions } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { useAppStore } from '@/store/app-store'

function DemoSide({
  label,
  price,
  transport,
  align,
}: {
  label: string
  price: string
  transport: string
  align?: 'right'
}) {
  return (
    <div className={align === 'right' ? 'grid gap-[7px] text-right' : 'grid gap-[7px]'}>
      <span className="text-[11px] text-muted">{label}</span>
      <strong className="text-[30px] tracking-[-.04em]">{price}</strong>
      <small className="text-[11px] text-muted">{transport}</small>
    </div>
  )
}

export function DemoScreen() {
  const router = useRouter()
  const goal = useAppStore((s) => s.goal)
  const loadExample = useAppStore((s) => s.loadExample)

  return (
    <Screen>
      <ScreenHeader title="Cómo funciona" backHref={goal ? '/onboarding/dificultades' : '/'} />
      <Progress step={3} />
      <section>
        <Eyebrow>Ejemplo ilustrativo</Eyebrow>
        <h1 className="mt-2.5 mb-8">Dos precios parecidos pueden terminar costando diferente.</h1>
        <div className="grid grid-cols-[1fr_30px_1fr] items-center border-y border-line py-[22px]">
          <DemoSide label="Alternativa A" price="S/ 100" transport="+ S/ 4 transporte" />
          <div className="grid size-[30px] place-items-center rounded-full border border-line text-[9px] text-accent">
            VS
          </div>
          <DemoSide
            label="Alternativa B"
            price="S/ 95"
            transport="+ S/ 2 transporte"
            align="right"
          />
        </div>
        <p className="mt-6 leading-[1.55] text-muted">
          El precio final depende del descuento aplicable, los beneficios de pago y los costos
          adicionales.
        </p>
      </section>
      <StickyActions>
        <Button
          onClick={() => {
            loadExample()
            router.push('/comparar')
          }}
        >
          Probar comparación <Icon name="arrow" />
        </Button>
      </StickyActions>
    </Screen>
  )
}
