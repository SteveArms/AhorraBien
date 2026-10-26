import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './icon'

type ChoiceProps = { selected: boolean; onClick: () => void; children: ReactNode }

/** Opción seleccionable tipo tarjeta (onboarding). */
export function Choice({ selected, onClick, children }: ChoiceProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'flex min-h-[70px] w-full items-center justify-between rounded-card border border-line bg-paper py-[13px] pr-[15px] pl-[18px] text-left transition duration-200 short:min-h-[58px]',
        selected && 'border-forest bg-sage',
      )}
    >
      <span>{children}</span>
      <i
        className={cn(
          'grid size-[25px] shrink-0 place-items-center rounded-full border border-line not-italic',
          selected && 'border-forest bg-forest text-white',
        )}
      >
        {selected && <Icon name="check" size={16} />}
      </i>
    </button>
  )
}
