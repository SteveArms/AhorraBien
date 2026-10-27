import { StorageNotice } from '@/components/layout/storage-notice'
import { WelcomeScreen } from '@/features/onboarding/components/welcome-screen'

export default function WelcomePage() {
  return (
    <>
      <StorageNotice />
      <WelcomeScreen />
    </>
  )
}
