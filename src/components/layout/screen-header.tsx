import type { ReactNode } from 'react'
import { IconButton } from '@/components/ui/icon-button'

type ScreenHeaderProps = {
  title: string
  /** Ruta a la que vuelve el botón atrás. */
  backHref?: string
  /** Alternativa a backHref cuando volver requiere lógica (p. ej. confirmar descarte). */
  onBack?: () => void
  action?: ReactNode
  /** Úsalo en pantallas sin otro `<h1>`. */
  titleAsHeading?: boolean
}

export function ScreenHeader({
  title,
  backHref,
  onBack,
  action,
  titleAsHeading,
}: ScreenHeaderProps) {
  const hasBack = backHref !== undefined || onBack !== undefined
  const Title = titleAsHeading ? 'h1' : 'strong'
  return (
    <header className="grid h-12 grid-cols-[48px_1fr_48px] items-center text-center">
      {hasBack ? (
        <IconButton
          icon="back"
          label="Volver"
          href={backHref}
          onClick={onBack}
          className="justify-self-end"
        />
      ) : (
        <span />
      )}
      <Title className="text-sm leading-normal font-bold tracking-normal">{title}</Title>
      {action ?? <span />}
    </header>
  )
}
