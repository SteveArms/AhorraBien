import type { Metadata } from 'next'
import { DemoScreen } from '@/features/onboarding/components/demo-screen'

export const metadata: Metadata = { title: 'Cómo funciona' }

export default function Page() {
  return <DemoScreen />
}
