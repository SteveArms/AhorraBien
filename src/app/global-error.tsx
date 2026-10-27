'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import './globals.css'

export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="es">
      <body className="font-[system-ui,sans-serif]">
        <title>Algo salió mal · AhorraBien</title>
        <main className="mx-auto grid min-h-dvh max-w-[600px] content-center justify-items-center gap-3 px-[22px] text-center">
          <h1 className="text-[32px]">Algo salió mal</h1>
          <p className="leading-normal text-muted">
            AhorraBien no pudo cargar. Intenta de nuevo o vuelve al inicio.
          </p>
          <div className="mt-3 grid gap-1">
            <button
              type="button"
              onClick={retry}
              className="min-h-[54px] rounded-ctl bg-forest px-6 font-bold text-paper"
            >
              Reintentar
            </button>
            <Link href="/" className="min-h-[42px] content-center font-bold text-forest">
              Volver al inicio
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
