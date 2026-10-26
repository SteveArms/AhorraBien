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
    <Screen>
      <ScreenHeader title="Tus comparaciones" />
      <section className="pt-[38px] pb-[25px]">
        <Eyebrow>Decisiones guardadas</Eyebrow>
        <h1 className="mt-2.5">
          Tu historial,
          <br />
          <em>con números claros.</em>
        </h1>
      </section>
      {saved.length ? (
        <section className="border-t border-line">
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
          className="pt-[85px]"
          title="Aún no hay comparaciones"
          description="Las que guardes aparecerán aquí para que puedas volver a revisarlas."
          action={
            <Button
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
