'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, ButtonLink } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Screen } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { useComparisonResult } from '@/hooks/use-comparison-result'
import { money } from '@/lib/format'
import { useAppStore } from '@/store/app-store'
import { selectIsDraftSaved } from '@/store/selectors'
import { LessonCard } from '@/features/learn/components/lesson-card'
import { suggestLesson } from '@/features/learn/lessons'
import { isExampleComparison } from '../lib/factories'
import { Breakdown } from './breakdown'
import { CostBlock } from './cost-block'
import { Verdict } from './verdict'

/** Resultado de la comparación del borrador actual (/resultado). */
export function ResultView() {
  const router = useRouter()
  const draft = useAppStore((s) => s.draft)
  const isSaved = useAppStore(selectIsDraftSaved)
  const save = useAppStore((s) => s.save)
  const startNew = useAppStore((s) => s.startNew)
  const removeCurrent = useAppStore((s) => s.removeCurrent)
  const flash = useAppStore((s) => s.flash)
  const { outcome } = useComparisonResult(draft)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!outcome) {
    return (
      <Screen className="lg:pt-4">
        <ScreenHeader title="Resultado" backHref="/comparar" />
        <EmptyState
          title="No podemos calcular todavía"
          description="Revisa los precios y asegúrate de que los descuentos no superen el precio original."
          action={<ButtonLink href="/comparar">Revisar datos</ButtonLink>}
        />
      </Screen>
    )
  }

  const { aCost, bCost, winner, difference } = outcome
  const lesson = suggestLesson(draft)

  return (
    <Screen size="wide" className="lg:pt-4">
      <ScreenHeader title="Resultado" backHref="/comparar" />

      <div className="xl:grid xl:grid-cols-2 xl:items-start xl:gap-14">
        <section className="pt-6 xl:sticky xl:top-20">
          {isExampleComparison(draft) && (
            <div className="mb-5 inline-block rounded-full border border-accent px-[9px] py-1.5 text-[9px] tracking-[.1em] text-accent">
              DATOS ILUSTRATIVOS
            </div>
          )}
          <Eyebrow>{draft.product}</Eyebrow>
          <h1 className="mt-2.5 mb-[27px]">
            {winner === 'tie' ? (
              'Ambas cuestan lo mismo.'
            ) : (
              <>
                Puedes pagar <em>{money(difference)} menos.</em>
              </>
            )}
          </h1>
          <div className="grid grid-cols-2 gap-2.5">
            <CostBlock label="Alternativa A" cost={aCost} winner={winner === 'a'} />
            <CostBlock label="Alternativa B" cost={bCost} winner={winner === 'b'} />
          </div>
          <Verdict outcome={outcome} />
        </section>

        <div className="xl:pt-6">
          <section className="border-t border-line pt-[25px] xl:border-t-0 xl:pt-0">
            <div className="flex items-center justify-between">
              <span className="font-bold">Cómo llegamos al resultado</span>
              <small className="text-[10px] text-muted">Desglose transparente</small>
            </div>
            <Breakdown title="Alternativa A" alt={draft.a} cost={aCost} />
            <Breakdown title="Alternativa B" alt={draft.b} cost={bCost} />
          </section>

          <section className="pt-7">
            <LessonCard lesson={lesson} variant="featured" />
          </section>

          <div className="grid gap-2.5 pt-[25px]">
            <Button onClick={save}>Guardar comparación</Button>
            <ButtonLink href="/comparar" variant="secondary">
              Editar comparación
            </ButtonLink>
            <Button
              variant="text"
              onClick={() => {
                startNew()
                router.push('/comparar')
              }}
            >
              Nueva comparación
            </Button>
            {isSaved && (
              <Button variant="text" onClick={() => setConfirmDelete(true)}>
                Eliminar del historial
              </Button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        preset="deleteOne"
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          removeCurrent()
          router.push('/historial')
          flash('Comparación eliminada')
        }}
      />
    </Screen>
  )
}
