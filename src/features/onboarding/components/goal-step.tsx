'use client'

import { useRouter } from 'next/navigation'
import { useId, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Choice } from '@/components/ui/choice'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Screen, StickyActions } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { usePreviousPath } from '@/hooks/use-back-navigation'
import { useAppStore } from '@/store/app-store'
import { GOALS } from '../constants'

export function GoalStep() {
  const router = useRouter()
  const goal = useAppStore((s) => s.goal)
  const setGoal = useAppStore((s) => s.setGoal)
  const fromProfile = usePreviousPath() === '/perfil'
  const [attempted, setAttempted] = useState(false)
  const options = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const errorId = useId()
  const missing = attempted && !goal

  const next = () => {
    if (goal) router.push(fromProfile ? '/perfil' : '/onboarding/dificultades')
    else {
      setAttempted(true)
      // Tras pintar el mensaje, para que el lector de pantalla lo lea como descripción del grupo.
      requestAnimationFrame(() => options.current?.querySelector('button')?.focus())
    }
  }

  return (
    <Screen>
      <ScreenHeader title="Tu punto de partida" backHref={fromProfile ? '/perfil' : '/'} />
      <Progress step={1} label="Objetivo" />
      <section>
        <Eyebrow>Una sola elección</Eyebrow>
        <h1 id={titleId} className="mt-2.5 mb-8">
          ¿Qué te gustaría mejorar al comprar?
        </h1>
        <div
          ref={options}
          role="group"
          aria-labelledby={titleId}
          aria-describedby={missing ? errorId : undefined}
          className="grid gap-3"
        >
          {GOALS.map((item) => (
            <Choice key={item} selected={goal === item} onClick={() => setGoal(item)}>
              {item}.
            </Choice>
          ))}
        </div>
        {missing && (
          <p id={errorId} className="mt-3 text-xs leading-snug text-danger">
            Elige una opción para continuar.
          </p>
        )}
      </section>
      <StickyActions>
        <Button onClick={next}>
          {fromProfile ? 'Guardar y volver al perfil' : 'Continuar'} <Icon name="arrow" />
        </Button>
      </StickyActions>
    </Screen>
  )
}
