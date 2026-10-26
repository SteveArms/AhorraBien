import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AltDetailsForm } from '@/features/comparison/components/alt-details-form'
import { ALT_KEYS, altKeySchema } from '@/schemas/comparison.schema'

type Props = { params: Promise<{ alt: string }> }

// Solo existen /comparar/a y /comparar/b; cualquier otro valor da 404.
export const dynamicParams = false
export const generateStaticParams = () => ALT_KEYS.map((alt) => ({ alt }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { alt } = await params
  return { title: `Alternativa ${alt.toUpperCase()}` }
}

export default async function Page({ params }: Props) {
  const parsed = altKeySchema.safeParse((await params).alt)
  if (!parsed.success) notFound()
  return <AltDetailsForm altKey={parsed.data} />
}
