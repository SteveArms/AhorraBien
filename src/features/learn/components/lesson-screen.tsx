'use client'

import { useRouter } from 'next/navigation'
import { Button, ButtonLink } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { IconButton } from '@/components/ui/icon-button'
import { Screen } from '@/components/layout/screen'
import { useBackNavigation, usePreviousPath } from '@/hooks/use-back-navigation'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/app-store'
import { LESSONS, getNextLesson, lessonToComparison, type Lesson } from '../lessons'
import { LessonExample } from './lesson-example'

const BACK_LABELS: Record<string, string> = {
  '/resultado': 'Volver al resultado',
  '/inicio': 'Volver al inicio',
  '/aprender': 'Volver a las lecciones',
}

/** Detalle de una lección (/aprender/[slug]): mito, realidad, ejemplo resuelto y cómo aplicarlo. */
export function LessonScreen({ lesson }: { lesson: Lesson }) {
  const router = useRouter()
  const back = useBackNavigation('/inicio')
  const previous = usePreviousPath()
  const backLabel = (previous && BACK_LABELS[previous]) ?? 'Volver'
  const loadDraft = useAppStore((s) => s.loadDraft)
  const next = getNextLesson(lesson.slug)
  // Se busca por slug: `lesson` llega serializado desde el server component.
  const position = LESSONS.findIndex((l) => l.slug === lesson.slug) + 1

  return (
    <Screen className="lg:max-w-6xl lg:pt-4">
      <div className="flex h-12 items-center justify-between gap-3">
        <IconButton icon="back" label={backLabel} onClick={back} />
        <span className="text-xs text-muted">Aprende en un minuto</span>
      </div>

      <div className="mt-3 lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
        <div className="lg:[@media(min-height:720px)]:sticky lg:[@media(min-height:720px)]:top-22">
          <header className="rounded-sheet bg-forest px-6 pt-6 pb-7 text-paper md:px-8 md:pt-7">
            <div className="flex items-center gap-4">
              <span className="font-serif text-[56px] leading-[.8] text-accent italic md:text-[64px]">
                {lesson.number}
              </span>
              <div className="grid gap-1">
                <span className="text-[11px] font-bold tracking-[.12em] uppercase">
                  Lección {position} de {LESSONS.length}
                </span>
                <span className="text-[13px] text-white/75">{lesson.minutes} min de lectura</span>
              </div>
            </div>
            <h1 className="mt-5 text-balance [&_em]:text-accent">
              {lesson.title.before}
              <em>{lesson.title.em}</em>
              {lesson.title.after}
            </h1>
            <div aria-hidden="true" className="mt-6 flex gap-1.5">
              {LESSONS.map((l, i) => (
                <span
                  key={l.slug}
                  className={cn(
                    'h-1 flex-1 rounded-full',
                    i < position ? 'bg-accent' : 'bg-white/20',
                  )}
                />
              ))}
            </div>
          </header>

          <section className="grid gap-3 pt-3">
            <div className="rounded-card border border-accent/35 bg-accent/10 p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-strong text-paper">
                  <Icon name="alert" size={16} />
                </span>
                <small className="text-[11px] font-bold tracking-[.12em]">LO QUE PARECE</small>
              </div>
              <p className="mt-3 leading-relaxed">“{lesson.myth}”</p>
            </div>
            <div className="rounded-card border border-forest bg-sage p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-forest text-paper">
                  <Icon name="check" size={16} />
                </span>
                <small className="text-[11px] font-bold tracking-[.12em] text-forest">
                  LO QUE REALMENTE PASA
                </small>
              </div>
              <p className="mt-3 leading-relaxed">{lesson.reality}</p>
            </div>
          </section>
        </div>

        <div>
          <LessonExample lesson={lesson} className="mt-8 lg:mt-0" />

          <aside className="mt-6 grid grid-cols-[36px_1fr] gap-3 rounded-card bg-forest p-5 text-paper">
            <span className="grid size-9 place-items-center rounded-full bg-accent-strong">
              <Icon name="check" size={18} />
            </span>
            <div>
              <small className="text-[9px] tracking-[.12em] text-white/65">PARA RECORDAR</small>
              <p className="mt-1 text-[17px] leading-snug font-semibold">{lesson.takeaway}</p>
            </div>
          </aside>

          <section className="mt-7">
            <Eyebrow>Úsalo en AhorraBien</Eyebrow>
            <ol className="mt-3 grid gap-3">
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

          <div className="grid gap-2.5 pt-7">
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
            {previous === '/resultado' && (
              <Button variant="text" onClick={back}>
                Volver a tu resultado
              </Button>
            )}
          </div>
        </div>
      </div>
    </Screen>
  )
}
