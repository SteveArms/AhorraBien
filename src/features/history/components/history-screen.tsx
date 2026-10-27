'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Screen } from '@/components/layout/screen'
import { ScreenHeader } from '@/components/layout/screen-header'
import { useOpenSaved } from '@/hooks/use-open-saved'
import { useAppStore } from '@/store/app-store'
import { HistoryItem } from './history-item'

export function HistoryScreen() {
  const router = useRouter()
  const saved = useAppStore((s) => s.saved)
  const startNew = useAppStore((s) => s.startNew)
  const openSaved = useOpenSaved()

  return (
    <Screen className="lg:max-w-[1040px] lg:pt-4">
      <ScreenHeader title="Tus comparaciones" />
      <section className="pt-[38px] pb-[25px] lg:pt-6">
        <Eyebrow>Decisiones guardadas</Eyebrow>
        <h1 className="mt-2.5">
          Tu historial,
          <br />
          <em>con números claros.</em>
        </h1>
      </section>
      {saved.length ? (
        <section className="border-t border-line lg:grid lg:grid-cols-2 lg:gap-3 lg:border-t-0">
          {saved.map((item, index) => (
            <HistoryItem
              key={item.id}
              comparison={item}
              index={index}
              onOpen={() => openSaved(item.id)}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          decorated
          className="mt-2 rounded-card border border-dashed border-line px-6 py-14 lg:py-20"
          title="Aún no hay comparaciones"
          description="Las que guardes aparecerán aquí para que puedas volver a revisarlas."
          action={
            <Button
              className="mt-3"
              onClick={() => {
                startNew()
                router.push('/comparar')
              }}
            >
              Crear la primera
            </Button>
          }
        />
      )}
    </Screen>
  )
}
