import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
  /** Muestra las tres líneas decorativas sobre el título. */
  decorated?: boolean
  /** Úsalo cuando el estado vacío es el contenido principal de la pantalla. */
  heading?: 'h1' | 'h2'
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  decorated,
  heading,
  className,
}: EmptyStateProps) {
  const Title = heading ?? 'strong'
  return (
    <section
      className={cn('grid justify-items-center gap-2.5 px-3 py-[42px] text-center', className)}
    >
      {decorated && (
        <div aria-hidden="true" className="relative mb-2 h-[52px] w-20">
          <i className="absolute top-[15px] left-[5px] h-px w-[68px] -rotate-12 bg-forest" />
          <i className="absolute top-[28px] left-[5px] h-px w-[68px] rotate-12 bg-accent" />
          <i className="absolute top-10 left-[5px] h-px w-[68px] bg-line" />
        </div>
      )}
      <Title className="text-base leading-normal font-bold tracking-normal">{title}</Title>
      <p className="text-sm leading-normal text-muted">{description}</p>
      {action}
    </section>
  )
}
