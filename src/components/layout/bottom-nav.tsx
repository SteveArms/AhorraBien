'use client'

import { usePathname } from 'next/navigation'
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
          <button
            type="button"
            onClick={() => navigate('/inicio')}
            className="hidden items-center gap-2.5 border-0 bg-transparent lg:flex"
          >
            <Mark size="sm" />
            <strong>AhorraBien</strong>
          </button>
          <div className="mx-auto grid max-w-[520px] grid-cols-4 lg:mx-0 lg:flex lg:max-w-none lg:gap-1">
            {ITEMS.map(({ href, icon, label }) => {
              const active = pathname === href
              return (
                <button
                  key={href}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  // "Comparar" siempre abre una comparación nueva.
                  onClick={() => navigate(href, href === '/comparar' ? startNew : undefined)}
                  className={cn(
                    'grid justify-items-center gap-[3px] border-0 bg-transparent text-[10px] text-muted',
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
                </button>
              )
            })}
          </div>
        </div>
      </nav>
      <ConfirmDialog preset="discard" {...discardDialog} />
    </>
  )
}
