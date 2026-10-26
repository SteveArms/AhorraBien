import type { Metadata } from 'next'
import { LessonsIndexScreen } from '@/features/learn/components/lessons-index-screen'

export const metadata: Metadata = { title: 'Aprendizaje' }

export default function Page() {
  return <LessonsIndexScreen />
}
