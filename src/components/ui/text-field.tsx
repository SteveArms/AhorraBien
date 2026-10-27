import { useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }

export function TextField({ label, error, ...props }: TextFieldProps) {
  const errorId = useId()
  return (
    <label className="grid content-start gap-2">
      <span className="text-[11px] font-bold tracking-[.07em] text-muted uppercase">{label}</span>
      <input
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'min-h-[55px] w-full rounded-ctl border border-line bg-cream px-4 py-3 text-lg font-semibold outline-hidden transition-[border-color,box-shadow] duration-200 focus:border-forest focus:ring-3 focus:ring-forest/15',
          error && 'border-danger focus:border-danger focus:ring-danger/15',
        )}
        {...props}
      />
      {error && (
        <small id={errorId} className="text-xs leading-snug text-danger">
          {error}
        </small>
      )}
    </label>
  )
}
