'use client'

import { useRouter } from 'next/navigation'
import { Button, ButtonLink } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Mark } from '@/components/ui/mark'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Screen } from '@/components/layout/screen'
import { useAppStore } from '@/store/app-store'

export function WelcomeScreen() {
  const router = useRouter()
  const loadExample = useAppStore((s) => s.loadExample)

  return (
    <Screen size="wide" className="flex flex-col pb-[26px] lg:pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-lg font-bold">
          <Mark />
          <span>AhorraBien</span>
        </div>
        <span className="text-[9px] tracking-[.16em] text-muted [writing-mode:vertical-rl]">
          EDICIÓN PERSONAL · S/
        </span>
      </div>

      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <div
          aria-hidden="true"
          className="relative -mx-[22px] mt-[22px] mb-3 flex h-[270px] items-center justify-center overflow-hidden border-y border-line md:mx-0 md:rounded-sheet md:border-x lg:my-0 lg:h-[440px] short:h-[200px] short:lg:h-[360px]"
        >
          <span className="-translate-x-2 font-serif text-[180px] leading-none tracking-[-.15em] text-forest italic">
            A
          </span>
          <span className="-translate-x-5 font-serif text-[180px] leading-none tracking-[-.15em] text-transparent italic [-webkit-text-stroke:1px_var(--color-accent)]">
            B
          </span>
          <div className="absolute inset-x-[35px] inset-y-[38px] rounded-full border border-line">
            <i className="absolute top-1/2 -left-[5px] size-[9px] rounded-full bg-accent" />
            <i className="absolute top-1/2 -right-[5px] size-[9px] rounded-full bg-forest" />
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:flex-none">
          <div>
            <Eyebrow>Decide con el costo real</Eyebrow>
            <h1 className="mt-2.5 mb-3.5 short:text-[38px]">
              Tu dinero puede
              <br />
              <em>rendir más.</em>
            </h1>
            <p className="max-w-[330px] leading-normal text-muted">
              Compara precios, descuentos y gastos extra antes de decidir.
            </p>
          </div>

          <div className="mt-auto grid gap-[5px] pt-6 lg:mt-0 lg:max-w-[360px] lg:pt-10">
            <ButtonLink href="/onboarding/objetivo">
              Empezar <Icon name="arrow" />
            </ButtonLink>
            <Button
              variant="text"
              onClick={() => {
                loadExample()
                router.push('/demo')
              }}
            >
              Explorar una demostración
            </Button>
          </div>
        </div>
      </div>
    </Screen>
  )
}
