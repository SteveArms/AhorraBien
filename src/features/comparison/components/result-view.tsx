'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, ButtonLink } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { Screen } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { useComparisonResult } from '@/hooks/use-comparison-result'
import { money } from '@/lib/format'
import { useAppStore } from '@/store/app-store'
import { selectIsDraftSaved } from '@/store/selectors'
import type { AltField } from '@/types'
import { LessonCard } from '@/features/learn/components/lesson-card'
import { isLessonExample, suggestLesson } from '@/features/learn/lessons'
import { highlightedFields, topicWeights } from '@/features/personalization/topics'
import { detectIllusions } from '../lib/detect-illusions'
import { isExampleComparison } from '../lib/factories'
import { Breakdown } from './breakdown'
import { CostBlock } from './cost-block'
import { IllusionAlerts } from './illusion-alerts'
import { Verdict } from './verdict'

const FIELD_LABELS: Record<AltField, string> = {
  price: 'el precio',
  discount: 'el descuento',
  benefit: 'el beneficio de pago',
  transport: 'el transporte',
  extras: 'otros gastos',
  cashback: 'el cashback',
}
const FIELD_NAMES = new Intl.ListFormat('es', { type: 'conjunction' })

/** Resultado de la comparación del borrador actual (/resultado). */
export function ResultView() {
  const router = useRouter()
  const draft = useAppStore((s) => s.draft)
  const isSaved = useAppStore(selectIsDraftSaved)
  const save = useAppStore((s) => s.save)
  const startNew = useAppStore((s) => s.startNew)
  const removeCurrent = useAppStore((s) => s.removeCurrent)
  const flash = useAppStore((s) => s.flash)
  const dirty = useAppStore((s) => s.dirty)
  const goal = useAppStore((s) => s.goal)
  const difficulties = useAppStore((s) => s.difficulties)
  const { outcome } = useComparisonResult(draft)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!outcome) {
    return (
      <Screen className="lg:pt-4">
        <ScreenHeader title="Resultado" backHref="/comparar" />
        <EmptyState
          heading="h1"
          title="No podemos calcular todavía"
          description="Revisa los precios y asegúrate de que los descuentos no superen el precio original."
          action={<ButtonLink href="/comparar">Revisar datos</ButtonLink>}
        />
      </Screen>
    )
  }

  const { aCost, bCost, winner, difference } = outcome
  const lesson = suggestLesson(draft)
  const illusions = detectIllusions(draft, topicWeights({ goal, difficulties }))
  const highlight = highlightedFields(difficulties)

  return (
    <Screen size="wide" className="lg:pt-4">
      <ScreenHeader title="Resultado" backHref="/comparar" />

      <div className="xl:grid xl:grid-cols-2 xl:items-start xl:gap-14">
        <section className="pt-6 xl:sticky xl:top-20">
          {(isExampleComparison(draft) || isLessonExample(draft)) && (
            <div className="mb-5 inline-block rounded-full border border-accent-strong px-[9px] py-1.5 text-[9px] tracking-[.1em] text-accent-strong">
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
          <IllusionAlerts illusions={illusions} difficulties={difficulties} />
        </section>

        <div className="xl:pt-6">
          <section className="border-t border-line pt-[25px] xl:border-t-0 xl:pt-0">
            <div className="flex items-center justify-between">
              <span className="font-bold">Cómo llegamos al resultado</span>
              <small className="text-[10px] text-muted">Desglose transparente</small>
            </div>
            {highlight.length > 0 && (
              <p className="mt-2 text-xs leading-normal text-muted">
                Resaltamos {FIELD_NAMES.format(highlight.map((field) => FIELD_LABELS[field]))}{' '}
                porque marcaste que te cuesta calcularlo.
              </p>
            )}
            <Breakdown title="Alternativa A" alt={draft.a} cost={aCost} highlight={highlight} />
            <Breakdown title="Alternativa B" alt={draft.b} cost={bCost} highlight={highlight} />
          </section>

          <section className="pt-7">
            <LessonCard lesson={lesson} variant="featured" />
          </section>

          <div className="grid gap-2.5 pt-[25px]">
            {isSaved && !dirty ? (
              <p
                role="status"
                className="flex min-h-[54px] items-center justify-center gap-2 rounded-ctl bg-sage font-bold text-forest"
              >
                <Icon name="check" /> Guardada en tu historial
              </p>
            ) : (
              <Button onClick={save}>{isSaved ? 'Guardar cambios' : 'Guardar comparación'}</Button>
            )}
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
