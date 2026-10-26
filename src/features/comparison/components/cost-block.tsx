import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/cn'
import { money } from '@/lib/format'

type CostBlockProps = { label: string; cost: number; winner?: boolean }

export function CostBlock({ label, cost, winner }: CostBlockProps) {
  return (
    <div
      className={cn(
        'grid min-w-0 gap-1.5 rounded-card border border-line bg-paper p-4 transition duration-250',
        winner && 'animate-winner border-forest bg-sage',
      )}
    >
      <span className="text-[11px] text-muted">{label}</span>
      <strong className="text-[clamp(24px,7vw,31px)] tracking-[-.06em] whitespace-nowrap">
        {money(cost)}
      </strong>
      {winner && (
        <small className="flex items-center gap-1 text-forest">
          <Icon name="check" size={14} /> Mejor costo
        </small>
      )}
    </div>
  )
}
