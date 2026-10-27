import { AppNotices } from '@/components/layout/app-notices'
import { WelcomeScreen } from '@/features/onboarding/components/welcome-screen'

export default function WelcomePage() {
  return (
    <>
      <AppNotices />
      <WelcomeScreen />
    </>
  )
}
