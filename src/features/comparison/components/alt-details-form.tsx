'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { NumberField } from '@/components/ui/number-field'
import { Screen } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { useAltValidation } from '@/hooks/use-alt-validation'
import { money } from '@/lib/format'
import { useAppStore } from '@/store/app-store'
import type { AltField, AltKey } from '@/types'
import { calculateCost } from '../lib/calculate-cost'

const FIELDS: { field: AltField; label: string }[] = [
  { field: 'price', label: 'Precio original' },
  { field: 'discount', label: 'Descuento inmediato' },
  { field: 'benefit', label: 'Beneficio inmediato de pago' },
  { field: 'transport', label: 'Transporte' },
  { field: 'extras', label: 'Otros gastos' },
  { field: 'cashback', label: 'Cashback posterior (referencial)' },
]

/**
 * Paso 2: detalle de una alternativa (/comparar/a | /comparar/b).
 * Edita una copia local; solo se aplica al borrador al pulsar "Guardar cambios".
 */
export function AltDetailsForm({ altKey }: { altKey: AltKey }) {
  const router = useRouter()
  const original = useAppStore((s) => s.draft[altKey])
  const setAlt = useAppStore((s) => s.setAlt)
  const [alt, setLocalAlt] = useState(original)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const errors = useAltValidation(alt)
  const cost = calculateCost(alt)
  const changed = alt !== original
  const title = `Alternativa ${altKey.toUpperCase()}`

  const leave = () => router.push('/comparar')
  const cancel = () => (changed ? setConfirmOpen(true) : leave())
  // Los errores aparecen desde el primer cambio o al intentar guardar, no al abrir la pantalla.
  const showErrors = changed || submitted

  const saveChanges = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cost !== null) {
      setAlt(altKey, alt)
      leave()
      return
    }
    setSubmitted(true)
    const form = event.currentTarget
    requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
  }

  return (
    <Screen>
      <ScreenHeader title={title} onBack={cancel} titleAsHeading />

      <section className="grid gap-[5px] border-b border-line pt-[38px] pb-[25px]">
        <span className="text-xs text-muted">Costo actualizado</span>
        <strong className="text-[43px] tracking-[-.06em]">
          {cost === null ? '—' : money(cost)}
        </strong>
        <small className="text-xs text-muted">El cashback posterior no reduce este importe.</small>
      </section>

      <form noValidate onSubmit={saveChanges}>
        <section className="grid gap-[17px] pt-[22px] md:grid-cols-2 md:gap-x-4">
          {FIELDS.map(({ field, label }) => (
            <NumberField
              key={field}
              label={label}
              value={alt[field]}
              onChange={(value) => setLocalAlt((current) => ({ ...current, [field]: value }))}
              error={showErrors ? errors[field] : undefined}
              surface="paper"
            />
          ))}
        </section>

        <div className="mt-[25px] grid grid-cols-[1fr_1.2fr] gap-2.5">
          <Button variant="secondary" onClick={cancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar cambios</Button>
        </div>
      </form>

      <ConfirmDialog
        preset="discard"
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={leave}
      />
    </Screen>
  )
}
