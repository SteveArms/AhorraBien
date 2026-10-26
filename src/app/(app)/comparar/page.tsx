import type { Metadata } from 'next'
import { ComparisonForm } from '@/features/comparison/components/comparison-form'

export const metadata: Metadata = { title: 'Nueva comparación' }

export default function Page() {
  return <ComparisonForm />
}
