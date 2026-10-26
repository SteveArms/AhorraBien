'use client'

import { usePathname } from 'next/navigation'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Icon, type IconName } from '@/components/ui/icon'
import { useGuardedNavigation } from '@/hooks/use-guarded-navigation'
import { cn } from '@/lib/cn'
import { useAppStore } from '@/store/app-store'

const ITEMS: { href: string; icon: IconName; label: string }[] = [
  { href: '/inicio', icon: 'home', label: 'Inicio' },
  { href: '/comparar', icon: 'compare', label: 'Comparar' },
  { href: '/historial', icon: 'history', label: 'Historial' },
  { href: '/perfil', icon: 'user', label: 'Perfil' },
]

/** Rutas donde se muestra la barra inferior. */
export const BOTTOM_NAV_PATHS = ITEMS.map((item) => item.href)

export function BottomNav() {
  const pathname = usePathname()
  const startNew = useAppStore((s) => s.startNew)
  // Solo se pide confirmar descarte si se sale del formulario de comparación.
  const { navigate, discardDialog } = useGuardedNavigation(pathname.startsWith('/comparar'))

  return (
    <>
      <nav className="fixed bottom-0 z-10 grid w-full max-w-[430px] grid-cols-4 border-t border-line bg-paper/95 px-2.5 pt-[9px] pb-[max(10px,env(safe-area-inset-bottom))] backdrop-blur-md">
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
                active && 'font-bold text-forest',
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
      </nav>
      <ConfirmDialog preset="discard" {...discardDialog} />
    </>
  )
}
