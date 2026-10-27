import Link from 'next/link'
import { Eyebrow } from '@/components/ui/eyebrow'
import { LESSONS } from '../lessons'
import { LessonCard } from './lesson-card'

/** Sección del inicio con las lecciones en un carrusel horizontal. */
export function LessonsCarousel() {
  return (
    <section className="pt-8" aria-labelledby="lessons-title">
      <div className="flex items-end justify-between">
        <div>
          <Eyebrow>Aprende en un minuto</Eyebrow>
          <h2 id="lessons-title" className="mt-1.5 text-[22px] font-bold tracking-[-.03em]">
            Compra con más criterio
          </h2>
        </div>
        <Link href="/aprender" className="pb-1 text-xs font-bold text-forest underline">
          Ver todas
        </Link>
      </div>
      <div className="-mx-[22px] mt-4 flex snap-x snap-mandatory scroll-px-[22px] [scrollbar-width:none] gap-3 overflow-x-auto px-[22px] pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 xl:grid-cols-4">
        {LESSONS.map((lesson) => (
          <LessonCard key={lesson.slug} lesson={lesson} />
        ))}
      </div>
    </section>
  )
}
