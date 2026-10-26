import { cn } from '@/lib/cn'

type MarkProps = { size?: 'md' | 'sm'; bordered?: boolean }

/** Logotipo de AhorraBien. */
export function Mark({ size = 'md', bordered = true }: MarkProps) {
  return (
    <div
      aria-label="Símbolo AhorraBien"
      className={cn(
        'grid place-items-center text-forest',
        bordered && 'border border-forest',
        size === 'md' ? 'size-[58px] rounded-[18px]' : 'size-9 rounded-[10px]',
      )}
    >
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className={cn('fill-current', size === 'md' ? 'w-[38px]' : 'w-6')}
      >
        <path d="M10 48 28 14h8L21 48h-11Z" />
        <path d="M38 14 54 48H25l6-12h8l-5-12 4-10Z" opacity=".58" />
        <path d="M22 48h32" fill="none" stroke="currentColor" strokeWidth="5" />
      </svg>
    </div>
  )
}
