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
    <div className="flex items-center justify-between gap-4 border-b border-line py-[18px] last:border-b-0">
      <div className="grid min-w-0 gap-[5px]">
        <small className="text-[9px] tracking-[.1em] text-muted">{label}</small>
        <strong>{value}</strong>
      </div>
      {action}
    </div>
  )
}

function Disclosure({ title, children }: { title: string; children: string }) {
  return (
    <details className="group border-b border-line last:border-b-0">
      <summary className="-mx-5 flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-[18px] font-semibold transition-colors duration-150 hover:bg-cream focus-visible:outline-offset-[-3px]">
        {title}
        <Icon
          name="plus"
          className="shrink-0 text-forest transition-transform duration-150 ease-out group-open:rotate-45"
        />
      </summary>
      <p className="pb-[18px] text-[13px] leading-normal text-muted">{children}</p>
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
    <Screen className="lg:max-w-[1040px] lg:pt-4">
      <ScreenHeader title="Perfil" />
      <div className="lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:items-start lg:gap-14 lg:pt-6">
        <section className="grid grid-cols-[82px_1fr] items-center gap-[18px] pt-[35px] pb-7 lg:grid-cols-1 lg:items-start lg:p-0">
          <div className="grid size-[78px] place-items-center rounded-full bg-sage">
            <Mark bordered={false} />
          </div>
          <div>
            <Eyebrow>Tus preferencias</Eyebrow>
            <h1 className="mt-[7px] text-[36px]">Compra a tu manera.</h1>
            <p className="mt-3 hidden leading-normal text-muted lg:block">
              Ajusta tu objetivo y revisa cómo calculamos y cuidamos tus datos.
            </p>
          </div>
        </section>

        <div>
          <section className="overflow-hidden rounded-card border border-line bg-paper px-5">
            <InfoRow
              label="OBJETIVO SELECCIONADO"
              value={goal || 'Aún no seleccionado'}
              action={
                <Link
                  href="/onboarding/objetivo"
                  className="shrink-0 rounded-full border border-line px-3.5 py-2 text-xs font-bold text-forest transition-colors duration-150 hover:border-forest hover:bg-sage"
                >
                  Cambiar
                </Link>
              }
            />
            <InfoRow label="MONEDA" value="Soles peruanos (S/)" />
            <Disclosure title="Cómo se calculan los costos">
              Precio original menos descuentos y beneficios inmediatos, más transporte y otros
              gastos. El cashback posterior se muestra por separado.
            </Disclosure>
            <Disclosure title="Información de privacidad">
              Tus preferencias e historial se guardan solo en este dispositivo. No solicitamos
              información bancaria ni datos personales.
            </Disclosure>
          </section>
          {hasHistory && (
            <Button
              variant="danger"
              icon="trash"
              className="mt-5 w-full"
              onClick={() => setConfirmClear(true)}
            >
              Eliminar historial
            </Button>
          )}
        </div>
      </div>

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
