'use client'

import { useRouter } from 'next/navigation'
import { Button, ButtonLink } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Screen, StickyActions } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { exampleComparison } from '@/features/comparison/lib/factories'
import { lessonForTopic, lessonToComparison } from '@/features/learn/lessons'
import { LEARNING_GOAL, TOPIC_PROMISES, rankTopics } from '@/features/personalization/topics'
import { money } from '@/lib/format'
import { useAppStore } from '@/store/app-store'

type DemoSideProps = { label: string; price: string; detail: string; align?: 'right' }

function DemoSide({ label, price, detail, align }: DemoSideProps) {
  return (
    <div className={align === 'right' ? 'grid gap-[7px] text-right' : 'grid gap-[7px]'}>
      <span className="text-[11px] text-muted">{label}</span>
      <strong className="text-[clamp(22px,7vw,30px)] tracking-[-.04em]">{price}</strong>
      <small className="text-[11px] text-muted">{detail}</small>
    </div>
  )
}

function Versus() {
  return (
    <div className="grid size-[30px] place-items-center rounded-full border border-line text-[9px] text-accent-strong">
      VS
    </div>
  )
}

export function DemoScreen() {
  const router = useRouter()
  const goal = useAppStore((s) => s.goal)
  const difficulties = useAppStore((s) => s.difficulties)
  const startTrial = useAppStore((s) => s.startTrial)
  const topics = rankTopics({ goal, difficulties })
  const lesson = topics.length ? lessonForTopic(topics[0]) : undefined

  const tryIt = () => {
    startTrial(lesson ? lessonToComparison(lesson) : exampleComparison())
    router.push('/comparar')
  }

  return (
    <Screen>
      <ScreenHeader
        title={lesson ? 'Tu plan' : 'Cómo funciona'}
        backHref={goal ? '/onboarding/dificultades' : '/'}
      />
      <Progress step={3} />

      {lesson ? (
        <section>
          <Eyebrow>Según tus respuestas</Eyebrow>
          <h1 className="mt-2.5 mb-5">Tu plan para comprar mejor.</h1>
          <ul className="grid gap-2.5">
            {topics.slice(0, 3).map((topic) => (
              <li key={topic} className="grid grid-cols-[20px_1fr] gap-2.5 leading-snug">
                <Icon name="check" size={18} className="mt-0.5 text-forest" />
                {TOPIC_PROMISES[topic]}
              </li>
            ))}
            <li className="grid grid-cols-[20px_1fr] gap-2.5 leading-snug">
              <Icon name="check" size={18} className="mt-0.5 text-forest" />
              {goal === LEARNING_GOAL
                ? 'Te recomendamos las 4 lecciones, en orden.'
                : `Empieza por la lección ${lesson.number}: ${lesson.card.title}`}
            </li>
          </ul>
        </section>
      ) : (
        <section>
          <Eyebrow>Ejemplo ilustrativo</Eyebrow>
          <h1 className="mt-2.5 mb-8">Dos precios parecidos pueden terminar costando diferente.</h1>
        </section>
      )}

      {lesson ? (
        <section className="mt-8">
          <Eyebrow>Pruébalo con un ejemplo</Eyebrow>
          <h2 className="mt-2 text-[22px] font-bold tracking-[-.03em]">{lesson.example.product}</h2>
          <p className="mt-1.5 mb-4 text-sm leading-normal text-muted">{lesson.example.context}</p>
          <div className="grid grid-cols-[1fr_30px_1fr] items-center border-y border-line py-[22px]">
            <DemoSide
              label={lesson.example.options.a.label}
              price={money(lesson.example.options.a.alt.price)}
              detail={lesson.example.options.a.tag}
            />
            <Versus />
            <DemoSide
              label={lesson.example.options.b.label}
              price={money(lesson.example.options.b.alt.price)}
              detail={lesson.example.options.b.tag}
              align="right"
            />
          </div>
        </section>
      ) : (
        <section>
          <div className="grid grid-cols-[1fr_30px_1fr] items-center border-y border-line py-[22px]">
            <DemoSide label="Alternativa A" price="S/ 100" detail="+ S/ 4 transporte" />
            <Versus />
            <DemoSide
              label="Alternativa B"
              price="S/ 95"
              detail="+ S/ 2 transporte"
              align="right"
            />
          </div>
          <p className="mt-6 leading-[1.55] text-muted">
            El precio final depende del descuento aplicable, los beneficios de pago y los costos
            adicionales.
          </p>
        </section>
      )}

      <StickyActions>
        <Button onClick={tryIt}>
          {lesson ? 'Probar este ejemplo' : 'Probar comparación'} <Icon name="arrow" />
        </Button>
        {lesson ? (
          <ButtonLink href="/onboarding/dificultades" variant="text">
            Cambiar mis respuestas
          </ButtonLink>
        ) : (
          <ButtonLink href="/onboarding/objetivo" variant="text">
            Personalizar con 2 preguntas
          </ButtonLink>
        )}
      </StickyActions>
    </Screen>
  )
}
