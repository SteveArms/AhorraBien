import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import type { NextStep } from '../lib/next-steps'

export function NextSteps({ steps }: { steps: NextStep[] }) {
  if (!steps.length) return null
  return (
    <section aria-labelledby="next-steps-title" className="pt-7">
      <h2 id="next-steps-title" className="font-bold">
        Tu siguiente paso
      </h2>
      <ul className="mt-3 grid gap-2.5">
        {steps.map((step) => (
          <li
            key={step.id}
            className="grid grid-cols-[20px_1fr] gap-2.5 rounded-card border border-line bg-paper p-4"
          >
            <Icon name="arrow" size={18} className="mt-0.5 text-forest" />
            <div>
              <p className="text-sm leading-normal">{step.text}</p>
              {step.action && (
                <Link
                  href={step.action.href}
                  className="mt-2 inline-flex min-h-6 items-center gap-1 text-xs font-bold text-forest underline-offset-2 hover:underline"
                >
                  {step.action.label} <Icon name="arrow" size={14} />
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
