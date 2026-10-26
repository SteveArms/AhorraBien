import type { InputHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string }

export function TextField({ label, ...props }: TextFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-bold tracking-[.07em] text-muted uppercase">{label}</span>
      <input
        className="w-full border-0 border-b border-line bg-transparent pt-2 pb-3 text-lg font-semibold"
        {...props}
      />
    </label>
  )
}
