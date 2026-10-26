'use client'

import { useRouter } from 'next/navigation'
import { Button, ButtonLink } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { Screen } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { useBackNavigation } from '@/hooks/use-back-navigation'
import { useAppStore } from '@/store/app-store'
import { LESSONS, getNextLesson, lessonToComparison, type Lesson } from '../lessons'
import { LessonExample } from './lesson-example'

/** Detalle de una lección (/aprender/[slug]): mito, realidad, ejemplo resuelto y cómo aplicarlo. */
export function LessonScreen({ lesson }: { lesson: Lesson }) {
  const router = useRouter()
  const back = useBackNavigation('/inicio')
  const loadDraft = useAppStore((s) => s.loadDraft)
  const next = getNextLesson(lesson.slug)
  // Se busca por slug: `lesson` llega serializado desde el server component.
  const position = LESSONS.findIndex((l) => l.slug === lesson.slug) + 1

  return (
    <Screen className="px-0 pt-0">
      <div className="bg-forest px-[22px] pt-[max(20px,env(safe-area-inset-top))] pb-9 text-paper">
        <ScreenHeader title="Aprendizaje" onBack={back} tone="inverse" />
        <div className="mt-8 flex items-end justify-between">
          <span className="font-serif text-[96px] leading-[.8] text-accent italic">
            {lesson.number}
          </span>
          <span className="rounded-full border border-white/25 px-2.5 py-1 text-[10px] tracking-[.1em]">
            LECCIÓN {position} DE {LESSONS.length} · {lesson.minutes} MIN
          </span>
        </div>
        <Eyebrow className="mt-7">Un minuto para comprar mejor</Eyebrow>
        <h1 className="mt-2.5 [&_em]:text-accent">
          {lesson.title.before}
          <em>{lesson.title.em}</em>
          {lesson.title.after}
        </h1>
      </div>

      <div className="px-[22px]">
        <section className="grid gap-3 pt-7">
          <div className="rounded-card border border-line bg-paper p-[18px]">
            <small className="text-[9px] font-bold tracking-[.12em] text-muted">
              LO QUE PARECE
            </small>
            <p className="mt-2 leading-normal">“{lesson.myth}”</p>
          </div>
          <div className="rounded-card border border-forest bg-sage p-[18px]">
            <small className="text-[9px] font-bold tracking-[.12em] text-forest">
              LO QUE REALMENTE PASA
            </small>
            <p className="mt-2 leading-normal">{lesson.reality}</p>
          </div>
        </section>

        <LessonExample lesson={lesson} />

        <aside className="mt-8 grid grid-cols-[36px_1fr] gap-3 rounded-card bg-forest p-5 text-paper">
          <span className="grid size-9 place-items-center rounded-full bg-accent">
            <Icon name="check" size={18} />
          </span>
          <div>
            <small className="text-[9px] tracking-[.12em] text-white/65">PARA RECORDAR</small>
            <p className="mt-1 text-[17px] leading-snug font-semibold">{lesson.takeaway}</p>
          </div>
        </aside>

        <section className="mt-9">
          <Eyebrow>Úsalo en AhorraBien</Eyebrow>
          <ol className="mt-4 grid gap-4">
            {lesson.steps.map((step, index) => (
              <li key={step} className="grid grid-cols-[28px_1fr] gap-3">
                <span className="grid size-7 place-items-center rounded-full border border-forest text-[11px] font-bold text-forest">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-normal">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-2.5 pt-9">
          <Button
            onClick={() => {
              loadDraft(lessonToComparison(lesson))
              router.push('/resultado')
            }}
          >
            Ver este ejemplo en el comparador
          </Button>
          {next ? (
            <ButtonLink href={`/aprender/${next.slug}`} variant="secondary">
              Siguiente lección <Icon name="arrow" />
            </ButtonLink>
          ) : (
            <ButtonLink href="/inicio" variant="secondary">
              Volver al inicio
            </ButtonLink>
          )}
        </div>
      </div>
    </Screen>
  )
}
