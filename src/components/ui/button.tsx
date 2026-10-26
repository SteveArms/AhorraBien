import Link from 'next/link'
import type { ButtonHTMLAttributes, ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './icon'

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-forest text-paper shadow-[0_8px_22px_#244d3b1d]',
  secondary: 'border border-forest bg-transparent text-forest',
  text: 'min-h-[42px] bg-transparent text-forest',
  danger: 'bg-danger-soft text-danger',
}

export const buttonClasses = (variant: ButtonVariant = 'primary', className?: string) =>
  cn(
    'inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-ctl border-0 px-5 font-bold transition-[transform,background-color,opacity] duration-200 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40',
    variants[variant],
    className,
  )

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  icon?: IconName
}

export function Button({ variant, icon, className, children, ...props }: ButtonProps) {
  return (
    <button type="button" className={buttonClasses(variant, className)} {...props}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  )
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant }

/** Igual que Button pero navega con next/link. */
export function ButtonLink({ variant, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />
}
