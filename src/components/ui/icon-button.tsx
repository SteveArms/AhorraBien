import Link from 'next/link'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './icon'

type IconButtonProps = {
  icon: IconName
  label: string
  href?: string
  onClick?: () => void
  className?: string
}

/** Botón circular de solo ícono. Con `href` navega, si no ejecuta `onClick`. */
export function IconButton({ icon, label, href, onClick, className }: IconButtonProps) {
  const classes = cn(
    'grid size-[42px] place-items-center rounded-full border border-line bg-transparent transition-colors duration-150 hover:border-forest hover:bg-sage',
    className,
  )
  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        <Icon name={icon} />
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} className={classes}>
      <Icon name={icon} />
    </button>
  )
}
