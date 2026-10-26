import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LessonScreen } from '@/features/learn/components/lesson-screen'
import { LESSONS, getLesson } from '@/features/learn/lessons'

type Props = { params: Promise<{ slug: string }> }

// Solo existen las lecciones definidas en LESSONS; cualquier otro slug da 404.
export const dynamicParams = false
export const generateStaticParams = () => LESSONS.map(({ slug }) => ({ slug }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lesson = getLesson((await params).slug)
  return { title: lesson?.card.title ?? 'Aprendizaje', description: lesson?.card.summary }
}

export default async function Page({ params }: Props) {
  const lesson = getLesson((await params).slug)
  if (!lesson) notFound()
  return <LessonScreen lesson={lesson} />
}
