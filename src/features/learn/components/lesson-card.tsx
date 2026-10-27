import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import type { Lesson } from '../lessons'

type LessonCardProps = {
  lesson: Lesson
  /**
   * - `carousel`: tarjeta angosta para el carrusel del inicio.
   * - `row`: fila de lista (índice de lecciones).
   * - `featured`: tarjeta destacada en verde (sugerencia en el resultado).
   */
  variant?: 'carousel' | 'row' | 'featured'
  /** Muestra la insignia "Para ti" (según el onboarding del usuario). */
  recommended?: boolean
}

function ForYou() {
  return (
    <span className="rounded-full bg-forest px-2 py-1 text-[10px] font-bold text-paper">
      Para ti
    </span>
  )
}

const href = (lesson: Lesson) => `/aprender/${lesson.slug}`

export function LessonCard({ lesson, variant = 'carousel', recommended }: LessonCardProps) {
  const { number, minutes, card } = lesson

  if (variant === 'row') {
    return (
      <Link
        href={href(lesson)}
        className="grid grid-cols-[44px_1fr_auto] items-center gap-3 border-b border-line py-5"
      >
        <span className="font-serif text-[30px] leading-none text-accent italic">{number}</span>
        <div className="grid gap-1">
          {recommended && (
            <span className="justify-self-start">
              <ForYou />
            </span>
          )}
          <strong className="leading-tight">{card.title}</strong>
          <p className="text-[13px] leading-snug text-muted">{card.summary}</p>
        </div>
        <Icon name="arrow" size={18} className="text-forest" />
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link
        href={href(lesson)}
        className="grid gap-2 rounded-card bg-forest p-5 text-paper shadow-[0_8px_22px_#244d3b1d]"
      >
        <small className="text-[9px] tracking-[.12em] text-accent">
          APRENDE EN {minutes} MINUTO · LECCIÓN {number}
        </small>
        <strong className="text-lg leading-tight">{card.title}</strong>
        <p className="text-[13px] leading-snug text-white/75">{card.summary}</p>
        <span className="mt-1 flex items-center gap-1 text-xs font-bold">
          Leer lección <Icon name="arrow" size={14} />
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={href(lesson)}
      className="flex w-[236px] shrink-0 snap-start flex-col rounded-card border border-line bg-paper p-[18px] transition-transform duration-200 active:scale-[.98] md:w-auto"
    >
      <div className="flex items-start justify-between">
        <span className="font-serif text-[34px] leading-none text-accent italic">{number}</span>
        <span className="flex gap-1.5">
          {recommended && <ForYou />}
          <span className="rounded-full bg-sage px-2 py-1 text-[10px] font-bold text-forest">
            {minutes} min
          </span>
        </span>
      </div>
      <strong className="mt-4 text-[17px] leading-tight tracking-[-.02em]">{card.title}</strong>
      <p className="mt-2 text-[13px] leading-snug text-muted">{card.summary}</p>
      <span className="mt-auto flex items-center gap-1 pt-4 text-xs font-bold text-forest">
        Leer lección <Icon name="arrow" size={14} />
      </span>
    </Link>
  )
}
