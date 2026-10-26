import type { Metadata } from 'next'
import { ResultView } from '@/features/comparison/components/result-view'

export const metadata: Metadata = { title: 'Resultado' }

export default function Page() {
  return <ResultView />
}
