'use client'

import { ButtonLink } from '@/components/ui/button'
import { Choice } from '@/components/ui/choice'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Screen, StickyActions } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { usePreviousPath } from '@/hooks/use-back-navigation'
import { useAppStore } from '@/store/app-store'
import { DIFFICULTIES } from '../constants'

export function DifficultyStep() {
  const difficulties = useAppStore((s) => s.difficulties)
  const toggleDifficulty = useAppStore((s) => s.toggleDifficulty)
  const fromProfile = usePreviousPath() === '/perfil'

  return (
    <Screen>
      <ScreenHeader
        title="Tu punto de partida"
        backHref={fromProfile ? '/perfil' : '/onboarding/objetivo'}
      />
      <Progress step={2} />
      <section>
        <Eyebrow>Puedes elegir varias</Eyebrow>
        <h1 className="mt-2.5 mb-8">¿Qué suele hacer más difícil elegir?</h1>
        <div className="grid gap-3">
          {DIFFICULTIES.map((item) => (
            <Choice
              key={item}
              selected={difficulties.includes(item)}
              onClick={() => toggleDifficulty(item)}
            >
              {item}.
            </Choice>
          ))}
        </div>
      </section>
      <StickyActions>
        {fromProfile ? (
          <ButtonLink href="/perfil">
            Guardar y volver al perfil <Icon name="arrow" />
          </ButtonLink>
        ) : (
          <>
            <ButtonLink href="/demo">
              Continuar <Icon name="arrow" />
            </ButtonLink>
            <ButtonLink href="/onboarding/objetivo" variant="text">
              Volver
            </ButtonLink>
          </>
        )}
      </StickyActions>
    </Screen>
  )
}
