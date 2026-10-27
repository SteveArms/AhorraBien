'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
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
import { isIllustrative } from '../lib/illustrative'

type Field = 'product' | 'a' | 'b'

/** Paso 1: nombre del producto y precio de cada alternativa (/comparar). */
export function ComparisonForm() {
  const router = useRouter()
  const draft = useAppStore((s) => s.draft)
  const trial = useAppStore((s) => s.trial)
  const setProduct = useAppStore((s) => s.setProduct)
  const setAltField = useAppStore((s) => s.setAltField)
  const errorsA = useAltValidation(draft.a)
  const errorsB = useAltValidation(draft.b)
  const { navigate, discardDialog } = useGuardedNavigation()
  // Se fija al entrar: el texto no debe cambiar mientras la persona escribe.
  const [fromExample] = useState(() => isIllustrative(draft))

  const productError = productSchema.safeParse(draft.product).success ? undefined : MESSAGES.product
  const canCompare = !productError && !errorsA.price && !errorsB.price

  // Un campo muestra su error al dejarlo o al intentar comparar, no mientras se llena por primera vez.
  const [touched, setTouched] = useState<ReadonlySet<Field>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const touch = (field: Field) => setTouched((prev) => new Set(prev).add(field))
  const shown = (field: Field, error?: string) =>
    submitted || touched.has(field) ? error : undefined

  const compare = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (canCompare) {
      router.push('/resultado')
      return
    }
    setSubmitted(true)
    const form = event.currentTarget
    requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
  }

  return (
    <Screen className="lg:max-w-[1040px] lg:pt-4">
      <ScreenHeader title="Nueva comparación" onBack={() => navigate('/inicio')} />

      <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 lg:pt-4">
        <section className="pt-3 pb-5 lg:p-0">
          <div className="flex items-center gap-3">
            {/* Desde la demo, comparar es el último paso del onboarding y sigue su numeración. */}
            <Eyebrow className="shrink-0">{trial ? 'Paso 4 de 4' : 'Paso 1 de 2'}</Eyebrow>
            <Progress
              step={trial ? 4 : 1}
              total={trial ? 4 : 2}
              className="my-0 flex-1 short:mb-0"
            />
          </div>
          <h1 className="mt-3 mb-2 text-[clamp(30px,8vw,34px)] lg:text-[42px]">
            ¿Qué alternativas quieres comparar?
          </h1>
          <p className="leading-normal text-muted">
            {fromExample
              ? 'Usa montos reales o edita el ejemplo.'
              : 'Escribe el producto y el precio que viste en cada tienda.'}
          </p>
        </section>

        <form noValidate onSubmit={compare}>
          <section className="rounded-card border border-line bg-paper px-4 pt-3.5 pb-4">
            <TextField
              label="Nombre del producto"
              value={draft.product}
              onChange={(e) => setProduct(e.target.value)}
              onBlur={() => touch('product')}
              placeholder="Ej. Auriculares inalámbricos"
              error={shown('product', productError)}
            />
          </section>

          <section className="mt-3 rounded-card border border-line px-4 pt-3.5 pb-4">
            <h2 className="text-sm font-bold">Precio de cada alternativa</h2>
            <div className="mt-2.5 grid grid-cols-2 gap-3">
              <NumberField
                label="Alternativa A"
                value={draft.a.price}
                onChange={(v) => setAltField('a', 'price', v)}
                onBlur={() => touch('a')}
                error={shown('a', errorsA.price)}
                surface="paper"
              />
              <NumberField
                label="Alternativa B"
                value={draft.b.price}
                onChange={(v) => setAltField('b', 'price', v)}
                onBlur={() => touch('b')}
                error={shown('b', errorsB.price)}
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
            <Button type="submit">Comparar costos reales</Button>
          </div>
        </form>
      </div>

      <ConfirmDialog preset="discard" {...discardDialog} />
    </Screen>
  )
}
