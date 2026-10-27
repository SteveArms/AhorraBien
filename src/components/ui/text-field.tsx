import type { InputHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string }

export function TextField({ label, ...props }: TextFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-bold tracking-[.07em] text-muted uppercase">{label}</span>
      <input
        className="min-h-[55px] w-full rounded-ctl border border-line bg-cream px-4 py-3 text-lg font-semibold outline-hidden transition-[border-color,box-shadow] duration-200 focus:border-forest focus:ring-3 focus:ring-forest/15"
        {...props}
      />
    </label>
  )
}
