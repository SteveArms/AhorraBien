'use client'

import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app-store'

/** Carga una comparación del historial como borrador y abre /resultado. */
export function useOpenSaved() {
  const router = useRouter()
  const openSaved = useAppStore((s) => s.openSaved)
  return (id: string) => {
    openSaved(id)
    router.push('/resultado')
  }
}
