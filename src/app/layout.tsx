import type { Metadata, Viewport } from 'next'
import { DM_Sans, Newsreader } from 'next/font/google'
import type { ReactNode } from 'react'
import { AppFrame } from '@/components/layout/app-frame'
import { NavigationTracker } from '@/components/layout/navigation-tracker'
import { StoreHydrator } from '@/components/layout/store-hydrator'
import { Toast } from '@/components/ui/toast'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['500', '600'],
  variable: '--font-newsreader',
})

export const metadata: Metadata = {
  title: { default: 'AhorraBien', template: '%s · AhorraBien' },
  description:
    'Compara el costo real de tus compras en soles, sumando descuentos y gastos adicionales para ayudarte a elegir la alternativa más económica y ahorrar mejor.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  themeColor: '#f7f3e8',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${newsreader.variable}`}>
      <body>
        <StoreHydrator />
        <NavigationTracker />
        <AppFrame>
          {children}
          <Toast />
        </AppFrame>
      </body>
    </html>
  )
}
