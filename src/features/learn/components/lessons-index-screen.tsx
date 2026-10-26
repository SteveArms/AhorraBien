'use client'

import { Eyebrow } from '@/components/ui/eyebrow'
import { Screen } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { useBackNavigation } from '@/hooks/use-back-navigation'
import { LESSONS } from '../lessons'
import { LessonCard } from './lesson-card'

/** Lista de todas las lecciones (/aprender). */
export function LessonsIndexScreen() {
  const back = useBackNavigation('/inicio')
  return (
    <Screen>
      <ScreenHeader title="Aprendizaje" onBack={back} />
      <section className="pt-[38px] pb-[25px]">
        <Eyebrow>Un minuto para comprar mejor</Eyebrow>
        <h1 className="mt-2.5">
          Aprende a ver
          <br />
          <em>el costo real.</em>
        </h1>
        <p className="mt-4 max-w-[330px] leading-normal text-muted">
          Lecciones cortas con ejemplos en soles para que ninguna oferta te confunda.
        </p>
      </section>
      <section className="border-t border-line">
        {LESSONS.map((lesson) => (
          <LessonCard key={lesson.slug} lesson={lesson} variant="row" />
        ))}
      </section>
    </Screen>
  )
}
