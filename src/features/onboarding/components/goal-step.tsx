'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Choice } from '@/components/ui/choice'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Screen, StickyActions } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { useAppStore } from '@/store/app-store'
import { GOALS } from '../constants'

export function GoalStep() {
  const router = useRouter()
  const goal = useAppStore((s) => s.goal)
  const setGoal = useAppStore((s) => s.setGoal)

  return (
    <Screen>
      <ScreenHeader title="Tu punto de partida" backHref="/" />
      <Progress step={1} />
      <section>
        <Eyebrow>Una sola elección</Eyebrow>
        <h1 className="mt-2.5 mb-8">¿Qué te gustaría mejorar al comprar?</h1>
        <div className="grid gap-3">
          {GOALS.map((item) => (
            <Choice key={item} selected={goal === item} onClick={() => setGoal(item)}>
              {item}.
            </Choice>
          ))}
        </div>
      </section>
      <StickyActions>
        <Button disabled={!goal} onClick={() => router.push('/onboarding/dificultades')}>
          Continuar <Icon name="arrow" />
        </Button>
      </StickyActions>
    </Screen>
  )
}
