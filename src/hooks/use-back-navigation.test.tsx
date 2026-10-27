import { act, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useTrackNavigation } from './use-back-navigation'

let pathname = '/inicio'
vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}))

function Page({ title }: { title: string }) {
  useTrackNavigation()
  return (
    <main>
      <h1>{title}</h1>
      <button type="button">Acción</button>
    </main>
  )
}

const nextFrame = () => act(() => new Promise((resolve) => requestAnimationFrame(resolve)))

describe('useTrackNavigation', () => {
  it('no mueve el foco en la primera pantalla y lo lleva al h1 al navegar', async () => {
    const { rerender, getByText } = render(<Page title="Inicio" />)
    await nextFrame()
    expect(document.activeElement).toBe(document.body)

    pathname = '/historial'
    rerender(<Page title="Tu historial" />)
    await nextFrame()
    expect(document.activeElement).toBe(getByText('Tu historial'))
  })
})
