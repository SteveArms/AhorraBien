import type { Metadata } from 'next'
import { DifficultyStep } from '@/features/onboarding/components/difficulty-step'

export const metadata: Metadata = { title: 'Tus dificultades' }

export default function Page() {
  return <DifficultyStep />
}
