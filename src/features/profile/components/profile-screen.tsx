'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { Mark } from '@/components/ui/mark'
import { Screen } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { useAppStore } from '@/store/app-store'

function InfoRow({ label, value, action }: { label: string; value: string; action?: ReactNode }) {
  return (
    <div className="relative grid gap-[5px] border-b border-line py-[19px]">
      <small className="text-[9px] tracking-[.1em] text-muted">{label}</small>
      <strong>{value}</strong>
      {action}
    </div>
  )
}

function Disclosure({ title, children }: { title: string; children: string }) {
  return (
    <details className="border-b border-line py-[19px]">
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
        {title} <Icon name="plus" />
      </summary>
      <p className="pt-3 text-[13px] leading-normal text-muted">{children}</p>
    </details>
  )
}

export function ProfileScreen() {
  const goal = useAppStore((s) => s.goal)
  const hasHistory = useAppStore((s) => s.saved.length > 0)
  const clearHistory = useAppStore((s) => s.clearHistory)
  const flash = useAppStore((s) => s.flash)
  const [confirmClear, setConfirmClear] = useState(false)

  return (
    <Screen>
      <ScreenHeader title="Perfil" />
      <section className="grid grid-cols-[82px_1fr] items-center gap-[18px] pt-[35px] pb-7">
        <div className="grid size-[78px] place-items-center rounded-full bg-sage">
          <Mark bordered={false} />
        </div>
        <div>
          <Eyebrow>Tus preferencias</Eyebrow>
          <h1 className="mt-[7px] text-[36px]">Compra a tu manera.</h1>
        </div>
      </section>

      <section className="border-t border-line">
        <InfoRow
          label="OBJETIVO SELECCIONADO"
          value={goal || 'Aún no seleccionado'}
          action={
            <Link
              href="/onboarding/objetivo"
              className="absolute top-[21px] right-0 text-xs text-forest underline"
            >
              Cambiar
            </Link>
          }
        />
        <InfoRow label="MONEDA" value="Soles peruanos (S/)" />
        <Disclosure title="Cómo se calculan los costos">
          Precio original menos descuentos y beneficios inmediatos, más transporte y otros gastos.
          El cashback posterior se muestra por separado.
        </Disclosure>
        <Disclosure title="Información de privacidad">
          Tus preferencias e historial se guardan solo en este dispositivo. No solicitamos
          información bancaria ni datos personales.
        </Disclosure>
        {hasHistory && (
          <Button
            variant="danger"
            icon="trash"
            className="mt-[30px] w-full"
            onClick={() => setConfirmClear(true)}
          >
            Eliminar historial
          </Button>
        )}
      </section>

      <ConfirmDialog
        preset="deleteAll"
        open={confirmClear}
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clearHistory()
          setConfirmClear(false)
          flash('Historial eliminado')
        }}
      />
    </Screen>
  )
}
