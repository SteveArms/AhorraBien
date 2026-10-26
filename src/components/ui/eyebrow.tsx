import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Texto pequeño en mayúsculas y color de acento que va sobre los títulos. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-[11px] font-bold tracking-[.12em] text-accent uppercase', className)}>
      {children}
    </p>
  )
}
