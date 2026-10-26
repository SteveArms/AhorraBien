import type { ReactNode } from 'react'

/** Consejo práctico numerado al pie de la pantalla de inicio. */
export function Tip({ number, children }: { number: string; children: ReactNode }) {
  return (
    <aside className="mt-3.5 grid grid-cols-[42px_1fr] gap-3 border-t border-line py-6">
      <span className="font-serif text-[30px] text-accent">{number}</span>
      <div>
        <small className="text-[9px] tracking-[.1em] text-muted">CONSEJO PRÁCTICO</small>
        <p className="mt-[5px] leading-[1.4]">{children}</p>
      </div>
    </aside>
  )
}
