import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './confirm-dialog'

function Harness({ onConfirm = () => {} }: { onConfirm?: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <main>
      <button type="button" onClick={() => setOpen(true)}>
        Eliminar
      </button>
      <ConfirmDialog
        preset="deleteOne"
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={onConfirm}
      />
    </main>
  )
}

describe('ConfirmDialog', () => {
  afterEach(cleanup)

  it('enfoca la acción menos destructiva y deja el fondo inerte', () => {
    const { container } = render(<Harness />)
    fireEvent.click(screen.getByText('Eliminar'))

    expect(screen.getByRole('dialog', { name: '¿Eliminar esta comparación?' })).toBeTruthy()
    expect(document.activeElement).toBe(screen.getByText('Cancelar'))
    expect((container as HTMLElement).inert).toBe(true)
  })

  it('cierra con Escape y devuelve el foco al botón que lo abrió', () => {
    const { container } = render(<Harness />)
    const trigger = screen.getByText('Eliminar')
    trigger.focus()
    fireEvent.click(trigger)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    })

    expect(screen.queryByRole('dialog')).toBeNull()
    expect((container as HTMLElement).inert).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })

  it('confirma con el botón de acción', () => {
    const onConfirm = vi.fn()
    render(<Harness onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('Eliminar'))
    fireEvent.click(screen.getByText('Eliminar comparación'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })
})
