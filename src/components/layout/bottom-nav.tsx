'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MouseEvent } from 'react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Icon, type IconName } from '@/components/ui/icon'
import { Mark } from '@/components/ui/mark'
import { useGuardedNavigation } from '@/hooks/use-guarded-navigation'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/app-store'

const ITEMS: { href: string; icon: IconName; label: string }[] = [
  { href: '/inicio', icon: 'home', label: 'Inicio' },
  { href: '/comparar', icon: 'compare', label: 'Comparar' },
  { href: '/historial', icon: 'history', label: 'Historial' },
  { href: '/perfil', icon: 'user', label: 'Perfil' },
]

/** Rutas donde se muestra la barra inferior en móvil. */
export const BOTTOM_NAV_PATHS = ITEMS.map((item) => item.href)

export function BottomNav({ showOnMobile }: { showOnMobile: boolean }) {
  const pathname = usePathname()
  const startNew = useAppStore((s) => s.startNew)
  // Solo se pide confirmar descarte si se sale del formulario de comparación.
  const { navigate, discardDialog } = useGuardedNavigation(pathname.startsWith('/comparar'))

  // Son enlaces reales (se anuncian como tales y se abren en otra pestaña con Ctrl o el botón
  // central); el clic normal pasa por la navegación protegida para confirmar el descarte.
  const follow = (href: string, before?: () => void) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    navigate(href, before)
  }

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className={cn(
          'fixed inset-x-0 bottom-0 z-10 border-t border-line bg-paper/95 px-2.5 pt-[9px] pb-[max(10px,env(safe-area-inset-bottom))] backdrop-blur-md',
          'lg:top-0 lg:bottom-auto lg:border-t-0 lg:border-b lg:px-0 lg:py-0',
          !showOnMobile && 'max-lg:hidden',
        )}
      >
        <div className="lg:mx-auto lg:flex lg:h-16 lg:max-w-[1040px] lg:items-center lg:justify-between lg:px-10">
          <Link
            href="/inicio"
            onClick={follow('/inicio')}
            className="hidden items-center gap-2.5 lg:flex"
          >
            <Mark size="sm" />
            <strong>AhorraBien</strong>
          </Link>
          <div className="mx-auto grid max-w-[520px] grid-cols-4 lg:mx-0 lg:flex lg:max-w-none lg:gap-1">
            {ITEMS.map(({ href, icon, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  // "Comparar" siempre abre una comparación nueva.
                  onClick={follow(href, href === '/comparar' ? startNew : undefined)}
                  className={cn(
                    'grid justify-items-center gap-[3px] text-[10px] text-muted',
                    'lg:flex lg:items-center lg:gap-2 lg:rounded-ctl lg:py-1 lg:pr-3 lg:pl-1 lg:text-sm lg:transition-colors lg:duration-200 lg:hover:bg-cream lg:hover:text-ink',
                    active &&
                      'font-bold text-forest lg:bg-sage lg:hover:bg-sage lg:hover:text-forest',
                  )}
                >
                  <Icon
                    name={icon}
                    className={cn('size-[34px] rounded-xl p-[7px]', active && 'bg-sage')}
                  />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
      <ConfirmDialog preset="discard" {...discardDialog} />
    </>
  )
}
