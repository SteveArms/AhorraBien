'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { NumberField } from '@/components/ui/number-field'
import { TextField } from '@/components/ui/text-field'
import { Screen } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { useAltValidation } from '@/hooks/use-alt-validation'
import { useGuardedNavigation } from '@/hooks/use-guarded-navigation'
import { productSchema, ALT_KEYS } from '@/schemas/comparison.schema'
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

  const canCompare =
    productSchema.safeParse(draft.product).success && !errorsA.price && !errorsB.price

  return (
    <Screen>
      <ScreenHeader title="Nueva comparación" onBack={() => navigate('/inicio')} />

      <section className="pt-8 pb-[25px]">
        <Eyebrow>Paso 1 de 2</Eyebrow>
        <h1 className="mt-2.5 mb-[15px] text-[39px]">¿Qué alternativas quieres comparar?</h1>
        <p className="max-w-[330px] leading-normal text-muted">
          Usa montos reales o modifica el ejemplo ilustrativo.
        </p>
      </section>

      <section className="rounded-card border border-line bg-paper p-[18px]">
        <TextField
          label="Nombre del producto"
          value={draft.product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Ej. Auriculares inalámbricos"
        />
        <div className="mt-[22px] grid grid-cols-2 gap-3">
          <NumberField
            label="Alternativa A"
            value={draft.a.price}
            onChange={(v) => setAltField('a', 'price', v)}
            error={errorsA.price}
          />
          <NumberField
            label="Alternativa B"
            value={draft.b.price}
            onChange={(v) => setAltField('b', 'price', v)}
            error={errorsB.price}
          />
        </div>
      </section>

      <section className="mt-[30px]">
        <Eyebrow>Detalles opcionales</Eyebrow>
        <p className="mt-[7px] mb-3.5 text-[13px] text-muted">
          Agrega descuentos, beneficios y gastos para una comparación precisa.
        </p>
        {ALT_KEYS.map((key) => (
          <Link
            key={key}
            href={`/comparar/${key}`}
            className="flex w-full items-center justify-between border-t border-line py-[17px] text-left"
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

      <div className="mt-[25px] grid gap-2.5">
        <Button disabled={!canCompare} onClick={() => router.push('/resultado')}>
          Comparar costos reales
        </Button>
      </div>

      <ConfirmDialog preset="discard" {...discardDialog} />
    </Screen>
  )
}
