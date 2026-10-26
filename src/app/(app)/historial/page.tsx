import type { Metadata } from 'next'
import { HistoryScreen } from '@/features/history/components/history-screen'

export const metadata: Metadata = { title: 'Historial' }

export default function Page() {
  return <HistoryScreen />
}
