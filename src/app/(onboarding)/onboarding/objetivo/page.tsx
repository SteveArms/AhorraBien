import type { Metadata } from 'next'
import { GoalStep } from '@/features/onboarding/components/goal-step'

export const metadata: Metadata = { title: 'Tu objetivo' }

export default function Page() {
  return <GoalStep />
}
