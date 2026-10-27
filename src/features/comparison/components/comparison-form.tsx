'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { NumberField } from '@/components/ui/number-field'
import { Progress } from '@/components/ui/progress'
import { TextField } from '@/components/ui/text-field'
import { Screen } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { useAltValidation } from '@/hooks/use-alt-validation'
import { useGuardedNavigation } from '@/hooks/use-guarded-navigation'
import { ALT_KEYS, MESSAGES, productSchema } from '@/schemas/comparison.schema'
import { useAppStore } from '@/store/app-store'

/** Paso 1: nombre del producto y precio de cada alternativa (/comparar). */
export function ComparisonForm() {
  const router = useRouter()
  const draft = useAppStore((s) => s.draft)
  const setProduct = useAppStore((s) => s.setProduct)
  const setAltField = useAppStore((s) => s.setAltField)
  const errorsA = useAltValidation(draft.a)
  const errorsB = useAltValidation(draft.b)
  const { navigate, discardDialog } = useGuardedNavigation()

  const productError = productSchema.safeParse(draft.product).success ? undefined : MESSAGES.product
  const canCompare = !productError && !errorsA.price && !errorsB.price

  return (
    <Screen className="lg:max-w-[1040px] lg:pt-4">
      <ScreenHeader title="Nueva comparación" onBack={() => navigate('/inicio')} />

      <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 lg:pt-4">
        <section className="pt-3 pb-5 lg:p-0">
          <div className="flex items-center gap-3">
            <Eyebrow className="shrink-0">Paso 1 de 2</Eyebrow>
            <Progress step={1} total={2} className="my-0 flex-1 short:mb-0" />
          </div>
          <h1 className="mt-3 mb-2 text-[clamp(30px,8vw,34px)] lg:text-[42px]">
            ¿Qué alternativas quieres comparar?
          </h1>
          <p className="leading-normal text-muted">Usa montos reales o edita el ejemplo.</p>
        </section>

        <div>
          <section className="rounded-card border border-line bg-paper px-4 pt-3.5 pb-4">
            <TextField
              label="Nombre del producto"
              value={draft.product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Ej. Auriculares inalámbricos"
              error={productError}
            />
          </section>

          <section className="mt-3 rounded-card border border-line px-4 pt-3.5 pb-4">
            <h2 className="text-sm font-bold">Precio de cada alternativa</h2>
            <div className="mt-2.5 grid grid-cols-2 gap-3">
              <NumberField
                label="Alternativa A"
                value={draft.a.price}
                onChange={(v) => setAltField('a', 'price', v)}
                error={errorsA.price}
                surface="paper"
              />
              <NumberField
                label="Alternativa B"
                value={draft.b.price}
                onChange={(v) => setAltField('b', 'price', v)}
                error={errorsB.price}
                surface="paper"
              />
            </div>
          </section>

          <section className="mt-5">
            <Eyebrow>Detalles opcionales</Eyebrow>
            <p className="mt-1 mb-2 text-[13px] text-muted">
              Descuentos, beneficios de pago y gastos extra.
            </p>
            {ALT_KEYS.map((key) => (
              <Link
                key={key}
                href={`/comparar/${key}`}
                className="flex w-full items-center justify-between border-t border-line py-3 text-left"
              >
                <span>
                  <b className="mr-2 inline-grid size-[27px] place-items-center rounded-full border border-forest text-[11px] text-forest">
                    {key.toUpperCase()}
                  </b>
                  Detalles de alternativa {key.toUpperCase()}
                </span>
                <Icon name="arrow" />
              </Link>
            ))}
          </section>

          <div className="mt-4 grid gap-2.5">
            <Button disabled={!canCompare} onClick={() => router.push('/resultado')}>
              Comparar costos reales
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog preset="discard" {...discardDialog} />
    </Screen>
  )
}
