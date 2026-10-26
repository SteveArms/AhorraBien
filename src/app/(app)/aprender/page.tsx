import type { Metadata } from 'next'
import { LessonScreen } from '@/features/learn/components/lesson-screen'

export const metadata: Metadata = { title: 'Aprendizaje' }

export default function Page() {
  return <LessonScreen />
}
