'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { LESSONS } from '@/features/learn/lessons'
import { useOnline } from '@/hooks/use-online'
import { useAppStore } from '@/store/app-store'
import { OfflineScreen } from './offline-screen'

const APP_ROUTES = [
  '/',
  '/onboarding/objetivo',
  '/onboarding/dificultades',
  '/demo',
  '/inicio',
  '/comparar',
  '/comparar/a',
  '/comparar/b',
  '/resultado',
  '/aprender',
  '/historial',
  '/perfil',
  ...LESSONS.map((lesson) => `/aprender/${lesson.slug}`),
]

type NavigateEventLike = Event & {
  destination: { url: string; sameDocument: boolean }
  downloadRequest: string | null
}

/** Precarga las pantallas y, sin conexión, muestra una pantalla propia en vez del error del navegador. */
export function ConnectionGuard() {
  const router = useRouter()
  const online = useOnline()
  const flash = useAppStore((s) => s.flash)
  const [blockedUrl, setBlockedUrl] = useState<string | null>(null)
  const wasOffline = useRef(false)

  useEffect(() => {
    if (!online) return
    APP_ROUTES.forEach((href) => router.prefetch(href))
  }, [online, router])

  useEffect(() => {
    if (!online) {
      wasOffline.current = true
      flash('Sin conexión: puedes seguir usando lo que ya cargaste.', 'info')
    } else if (wasOffline.current) {
      wasOffline.current = false
      flash('Conexión recuperada', 'info')
    }
  }, [online, flash])

  useEffect(() => {
    const navigation = (window as Window & { navigation?: EventTarget }).navigation
    if (!navigation) return
    const onNavigate = (event: Event) => {
      const e = event as NavigateEventLike
      if (navigator.onLine || !e.cancelable || e.destination.sameDocument || e.downloadRequest)
        return
      e.preventDefault()
      setBlockedUrl(e.destination.url)
    }
    navigation.addEventListener('navigate', onNavigate)
    return () => navigation.removeEventListener('navigate', onNavigate)
  }, [])

  return (
    <OfflineScreen
      open={blockedUrl !== null}
      onStay={() => setBlockedUrl(null)}
      onRetry={() => {
        if (navigator.onLine && blockedUrl) window.location.assign(blockedUrl)
        else flash('Todavía no hay conexión', 'info')
      }}
      onHome={() => {
        setBlockedUrl(null)
        router.push('/inicio')
      }}
    />
  )
}
