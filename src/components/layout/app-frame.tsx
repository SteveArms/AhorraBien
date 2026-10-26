import type { ReactNode } from 'react'

/** Marco tipo teléfono (máx. 430px) centrado en pantalla. */
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh justify-center bg-backdrop">
      <div className="relative min-h-dvh w-full max-w-[430px] overflow-x-hidden bg-cream shadow-[0_0_50px_#24272018]">
        {children}
      </div>
    </div>
  )
}
