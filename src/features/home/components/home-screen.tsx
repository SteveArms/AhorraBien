'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Icon } from '@/components/ui/icon'
import { Mark } from '@/components/ui/mark'
import { Screen } from '@/components/layout/screen'
import { LastComparisonCard } from '@/features/history/components/last-comparison-card'
import { LessonsCarousel } from '@/features/learn/components/lessons-carousel'
import { useOpenSaved } from '@/hooks/use-open-saved'
import { money } from '@/lib/format'
import { useAppStore } from '@/store/app-store'
import { selectTotalSavings } from '@/store/selectors'

export function HomeScreen() {
  const router = useRouter()
  const saved = useAppStore((s) => s.saved)
  const totalSavings = useAppStore(selectTotalSavings)
  const startNew = useAppStore((s) => s.startNew)
  const openSaved = useOpenSaved()
  const last = saved[0]

  return (
    <Screen size="wide" className="lg:pt-8">
      <header className="flex h-12 items-center justify-between lg:hidden">
        <div className="flex items-center gap-2.5">
          <Mark size="sm" />
          <strong>AhorraBien</strong>
        </div>
        <Link
          href="/perfil"
          aria-label="Abrir perfil"
          className="grid size-10 place-items-center rounded-full border border-line bg-paper"
        >
          <Icon name="user" />
        </Link>
      </header>

      <section className="border-b border-line pt-[50px] pb-9 lg:pt-0">
        <Eyebrow>Hola, compara con calma</Eyebrow>
        <h1 className="mt-3 mb-[18px]">
          Compra mejor,
          <br />
          <em>no solo más barato.</em>
        </h1>
        <p className="max-w-[330px] leading-normal text-muted">
          Compara el costo real antes de decidir.
        </p>
        <Button
          icon="plus"
          className="mt-7 w-full md:w-auto md:px-8"
          onClick={() => {
            startNew()
            router.push('/comparar')
          }}
        >
          Nueva comparación
        </Button>
      </section>

      <LessonsCarousel />

      {last ? (
        <section className="pt-7">
          <div className="flex items-center justify-between">
            <span className="font-bold">Tu actividad</span>
            <small className="text-[10px] text-muted">
              Ahorro potencial acumulado: {money(totalSavings)}
            </small>
          </div>
          <LastComparisonCard comparison={last} onOpen={() => openSaved(last.id)} />
        </section>
      ) : (
        <EmptyState
          decorated
          title="Tu primera decisión empieza aquí"
          description="Aún no guardaste comparaciones. Crea una y revisa el costo real."
        />
      )}
    </Screen>
  )
}
