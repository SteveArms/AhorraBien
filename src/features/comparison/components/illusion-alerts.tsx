import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { lessonForTopic } from '@/features/learn/lessons'
import { difficultyFor } from '@/features/personalization/topics'
import type { Illusion } from '../lib/detect-illusions'

type IllusionAlertsProps = { illusions: Illusion[]; difficulties: string[] }

/** Detector de ilusiones: lo que podría hacer parecer más barata a la alternativa equivocada. */
export function IllusionAlerts({ illusions, difficulties }: IllusionAlertsProps) {
  if (!illusions.length) return null
  return (
    <section aria-labelledby="illusions-title" className="mb-8">
      <h2 id="illusions-title" className="font-bold">
        Lo que podría engañarte
      </h2>
      <ul className="mt-3 grid gap-2.5">
        {illusions.map((illusion) => {
          const lesson = lessonForTopic(illusion.topic)
          const reason = difficultyFor(illusion.topic, difficulties)
          return (
            <li
              key={illusion.id}
              className="grid grid-cols-[32px_1fr] gap-3 rounded-card border border-accent/35 bg-accent/10 p-4"
            >
              <span className="grid size-8 place-items-center rounded-full bg-accent text-paper">
                <Icon name="alert" size={16} />
              </span>
              <div className="min-w-0">
                {reason && (
                  <small className="mb-1 block text-[11px] font-bold text-forest">
                    Marcaste: {reason.toLowerCase()}
                  </small>
                )}
                <strong className="leading-snug">{illusion.title}</strong>
                <p className="mt-1 text-sm leading-normal">{illusion.description}</p>
                {lesson && (
                  <Link
                    href={`/aprender/${lesson.slug}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-forest underline-offset-2 hover:underline"
                  >
                    Por qué pasa <Icon name="arrow" size={14} />
                  </Link>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
