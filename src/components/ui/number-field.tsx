'use client'

import { useId } from 'react'
import { cn } from '@/lib/cn'

type NumberFieldProps = {
  label: string
  value: number
  onChange: (value: number) => void
  error?: string
  prefix?: string
  /** Fondo del input: crema (dentro de tarjetas blancas) o blanco (sobre fondo crema). */
  surface?: 'cream' | 'paper'
}

/** Input numérico en soles. Un campo vacío se reporta como NaN para que lo marque la validación. */
export function NumberField({
  label,
  value,
  onChange,
  error,
  prefix = 'S/',
  surface = 'cream',
}: NumberFieldProps) {
  const errorId = useId()
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-bold tracking-[.07em] text-muted uppercase">{label}</span>
      <div
        className={cn(
          'flex min-h-[55px] items-center rounded-ctl border border-line px-3',
          surface === 'cream' ? 'bg-cream' : 'bg-paper',
          error && 'border-danger',
        )}
      >
        <b>{prefix}</b>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={Number.isNaN(value) ? '' : value}
          onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="w-full min-w-0 border-0 bg-transparent pl-1.5 text-xl font-bold"
        />
      </div>
      {error && (
        <small id={errorId} className="text-[10px] leading-tight text-danger">
          {error}
        </small>
      )}
    </label>
  )
}
