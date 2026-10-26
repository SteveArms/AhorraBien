import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { IconButton } from '@/components/ui/icon-button'

type ScreenHeaderProps = {
  title: string
  /** Ruta a la que vuelve el botón atrás. */
  backHref?: string
  /** Alternativa a backHref cuando volver requiere lógica (p. ej. confirmar descarte). */
  onBack?: () => void
  action?: ReactNode
  /** `inverse` para fondos oscuros. */
  tone?: 'default' | 'inverse'
}

export function ScreenHeader({
  title,
  backHref,
  onBack,
  action,
  tone = 'default',
}: ScreenHeaderProps) {
  const hasBack = backHref !== undefined || onBack !== undefined
  return (
    <header
      className={cn(
        'grid h-12 grid-cols-[48px_1fr_48px] items-center text-center',
        tone === 'inverse' && 'text-paper',
      )}
    >
      {hasBack ? (
        <IconButton
          icon="back"
          label="Volver"
          href={backHref}
          onClick={onBack}
          className={cn('justify-self-end', tone === 'inverse' && 'border-white/20')}
        />
      ) : (
        <span />
      )}
      <strong className="text-sm">{title}</strong>
      {action ?? <span />}
    </header>
  )
}
